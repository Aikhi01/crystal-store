export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF allowed' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary via REST API (no SDK needed)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    // Build multipart form for Cloudinary upload API
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const folder = 'crystal-store'

    // Generate signature: SHA-1 of "folder=...&timestamp=...{secret}"
    const { createHash } = await import('crypto')
    const signStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = createHash('sha1').update(signStr).digest('hex')

    const cloudForm = new FormData()
    cloudForm.append('file', new Blob([buffer], { type: file.type }), file.name)
    cloudForm.append('api_key', apiKey)
    cloudForm.append('timestamp', timestamp)
    cloudForm.append('folder', folder)
    cloudForm.append('signature', signature)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: cloudForm }
    )

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Cloudinary error: ${err}` }, { status: 500 })
    }

    const data = await res.json()
    const url = data.secure_url as string

    return NextResponse.json({ url, filename: data.public_id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
