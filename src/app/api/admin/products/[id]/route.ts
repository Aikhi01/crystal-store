export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

const UpdateSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  story: z.string().optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().nullable().optional(),
  images: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().min(1).optional(),
  weight: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  crystalType: z.string().optional(),
  chakra: z.string().optional(),
  healing: z.string().optional(),
})

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  try {
    const body = await request.json()
    const data = UpdateSchema.parse(body)
    const updateData: any = { ...data }
    if (data.name) updateData.slug = slugify(data.name)
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    })
    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  try {
    const orderItems = await prisma.orderItem.count({ where: { productId: id } })
    if (orderItems > 0) {
      await prisma.product.update({ where: { id }, data: { isActive: false } })
      return NextResponse.json({ message: 'Product deactivated (has existing orders)' })
    }
    await prisma.review.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
