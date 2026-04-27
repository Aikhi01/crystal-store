export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const take = searchParams.get('take')

    const where: any = { isActive: true }
    if (category) where.category = { slug: category }
    if (featured === 'true') where.featured = true

    const products = await prisma.product.findMany({
      where,
      include: { category: true, reviews: true },
      take: take ? parseInt(take) : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
