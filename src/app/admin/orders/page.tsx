import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') redirect('/auth/signin')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true, user: { select: { name: true, email: true } } },
  })

  const statusColors: Record<string, string> = {
    pending: 'badge-yellow',
    paid: 'badge-green',
    processing: 'badge-purple',
    shipped: 'badge bg-blue-100 text-blue-700',
    delivered: 'badge-green',
    cancelled: 'badge-red',
    refunded: 'badge bg-gray-100 text-gray-700',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Orders</h1>
        <Link href="/admin" className="btn-ghost text-sm">← Dashboard</Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Order</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Items</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono font-medium text-gray-900">#{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{order.user?.name ?? order.shippingName}</p>
                  <p className="text-gray-400 text-xs">{order.user?.email ?? order.guestEmail}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{order.items.length} item(s)</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <span className={statusColors[order.status] ?? 'badge bg-gray-100 text-gray-600'}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {format(new Date(order.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-crystal-600 hover:underline text-xs font-medium"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-10 text-gray-400">No orders yet</div>
        )}
      </div>
    </div>
  )
}
