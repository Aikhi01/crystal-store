import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import OrdersClient from './OrdersClient'

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') redirect('/auth/signin')

  // By default exclude auto-cancelled (unpaid pending) orders; admin can still filter by "cancelled" to see them
  const orders = await prisma.order.findMany({
    where: {
      NOT: {
        AND: [
          { status: 'cancelled' },
          { paymentStatus: 'unpaid' },
        ],
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: { select: { sku: true, name: true, price: true } } } },
      user: { select: { name: true, email: true } },
    },
  })

  return <OrdersClient orders={JSON.parse(JSON.stringify(orders))} />
}
