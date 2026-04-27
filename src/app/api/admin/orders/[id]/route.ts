import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
        address: true,
      },
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const allowed = ['status', 'trackingNumber', 'trackingUrl', 'notes']
    const updateData: Record<string, any> = {}
    for (const key of allowed) {
      if (key in body) updateData[key] = body[key]
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: true,
        user: { select: { name: true, email: true } },
        address: true,
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
