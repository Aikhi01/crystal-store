export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const ProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  story: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  images: z.string(), // JSON array
  stock: z.number().int().min(0),
  sku: z.string().min(3),
  weight: z.number().min(0),
  categoryId: z.string(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  crystalType: z.string().optional(),
  chakra: z.string().optional(),
  healing: z.string().optional(), // JSON array
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data = ProductSchema.parse(body)

    const slug = slugify(data.name)
    const product = await prisma.product.create({
      data: { ...data, slug },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
