'use client'

import { useState, useMemo } from 'react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'

type Order = {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  shippingName: string | null
  guestEmail: string | null
  items: { product: { sku: string | null; name: string } | null }[]
  user: { name: string | null; email: string | null } | null
}

async function cancelOrder(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelled' }),
  })
  return res.ok
}

const statusColors: Record<string, string> = {
  pending: 'badge-yellow',
  paid: 'badge-green',
  processing: 'badge-purple',
  shipped: 'badge bg-blue-100 text-blue-700',
  delivered: 'badge-green',
  cancelled: 'badge-red',
  refunded: 'badge bg-gray-100 text-gray-700',
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(orders.map(o => [o.id, o.status]))
  )
  const [cancelling, setCancelling] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return orders.filter(order => {
      const date = new Date(order.createdAt)
      if (dateFrom && date < new Date(dateFrom)) return false
      if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false
      const currentStatus = orderStatuses[order.id] ?? order.status
      if (statusFilter && currentStatus !== statusFilter) return false
      return true
    })
  }, [orders, dateFrom, dateTo, statusFilter, orderStatuses])

  async function handleCancel(id: string) {
    if (!confirm('Cancel this order?')) return
    setCancelling(id)
    const ok = await cancelOrder(id)
    if (ok) {
      setOrderStatuses(prev => ({ ...prev, [id]: 'cancelled' }))
    } else {
      alert('Failed to cancel order. Please try again.')
    }
    setCancelling(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Orders</h1>
        <Link href="/admin" className="btn-ghost text-sm">← Dashboard</Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crystal-300"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <button
          onClick={() => { setDateFrom(''); setDateTo(''); setStatusFilter('') }}
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Clear
        </button>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} order(s)</span>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Order</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">SKU</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Items</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono font-medium text-gray-900">#{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{order.user?.name ?? order.shippingName}</p>
                  <p className="text-gray-400 text-xs">{order.user?.email ?? order.guestEmail}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                  {order.items.map((item, i) => (
                    <div key={i}>{item.product?.sku ?? '—'}</div>
                  ))}
                </td>
                <td className="px-4 py-3 text-gray-600">{order.items.length} item(s)</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  {(() => {
                    const s = orderStatuses[order.id] ?? order.status
                    return (
                      <span className={statusColors[s] ?? 'badge bg-gray-100 text-gray-600'}>
                        {s}
                      </span>
                    )
                  })()}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {format(new Date(order.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-crystal-600 hover:underline text-xs font-medium"
                    >
                      View Details
                    </Link>
                    {(orderStatuses[order.id] ?? order.status) === 'pending' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancelling === order.id}
                        className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {cancelling === order.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">No orders found</div>
        )}
      </div>
    </div>
  )
}
