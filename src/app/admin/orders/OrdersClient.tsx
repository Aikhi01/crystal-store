'use client'

import { useState, useMemo } from 'react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'

type OrderItem = {
  product: { sku: string | null; name: string; price: number } | null
  quantity: number
  price: number
}

type Order = {
  id: string
  orderNumber: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: string
  createdAt: string
  // customer
  shippingName: string | null
  guestEmail: string | null
  user: { name: string | null; email: string | null } | null
  // shipping address (stored on Order)
  shippingLine1: string
  shippingLine2: string | null
  shippingCity: string
  shippingState: string | null
  shippingPostal: string
  shippingCountry: string
  // items
  items: OrderItem[]
}

async function cancelOrder(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelled' }),
  })
  return res.ok
}

function buildAddress(order: Order) {
  return [
    order.shippingLine1,
    order.shippingLine2,
    order.shippingCity,
    order.shippingState,
    order.shippingPostal,
    order.shippingCountry,
  ]
    .filter(Boolean)
    .join(', ')
}

async function exportXLSX(orders: Order[], statuses: Record<string, string>) {
  const XLSX = await import('xlsx')

  const rows = orders.map(o => ({
    'Order #': o.orderNumber,
    'Customer Name': o.user?.name ?? o.shippingName ?? '',
    'Customer Email': o.user?.email ?? o.guestEmail ?? '',
    'Product Name': o.items.map(i => i.product?.name ?? '').join(' / '),
    SKU: o.items.map(i => i.product?.sku ?? '').join(' / '),
    'Item Qty': o.items.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
    Subtotal: o.subtotal,
    Shipping: o.shipping,
    Tax: o.tax,
    'Total (USD)': o.total,
    Status: statuses[o.id] ?? o.status,
    'Shipping Name': o.shippingName ?? '',
    'Address Line 1': o.shippingLine1 ?? '',
    'Address Line 2': o.shippingLine2 ?? '',
    City: o.shippingCity ?? '',
    State: o.shippingState ?? '',
    'Postal Code': o.shippingPostal ?? '',
    Country: o.shippingCountry ?? '',
    'Full Address': buildAddress(o),
    Date: format(new Date(o.createdAt), 'yyyy-MM-dd HH:mm'),
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws['!cols'] = [
    { wch: 22 }, // Order #
    { wch: 18 }, // Customer Name
    { wch: 26 }, // Customer Email
    { wch: 30 }, // Product Name
    { wch: 12 }, // SKU
    { wch: 8  }, // Item Qty
    { wch: 10 }, // Subtotal
    { wch: 10 }, // Shipping
    { wch: 8  }, // Tax
    { wch: 12 }, // Total
    { wch: 12 }, // Status
    { wch: 18 }, // Shipping Name
    { wch: 28 }, // Address Line 1
    { wch: 18 }, // Address Line 2
    { wch: 16 }, // City
    { wch: 14 }, // State
    { wch: 12 }, // Postal Code
    { wch: 10 }, // Country
    { wch: 40 }, // Full Address
    { wch: 18 }, // Date
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Orders')
  XLSX.writeFile(wb, `orders-${format(new Date(), 'yyyyMMdd-HHmm')}.xlsx`)
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

const PAGE_SIZE = 10

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(orders.map(o => [o.id, o.status]))
  )
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)

  const filtered = useMemo(() => {
    setPage(1)
    return orders.filter(order => {
      const date = new Date(order.createdAt)
      if (dateFrom && date < new Date(dateFrom)) return false
      if (dateTo && date > new Date(dateTo + 'T23:59:59')) return false
      const currentStatus = orderStatuses[order.id] ?? order.status
      if (statusFilter && currentStatus !== statusFilter) return false
      return true
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, dateFrom, dateTo, statusFilter, orderStatuses])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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

  async function handleExport() {
    setExporting(true)
    await exportXLSX(filtered, orderStatuses)
    setExporting(false)
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
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-400">{filtered.length} order(s)</span>
          <button
            onClick={handleExport}
            disabled={exporting || filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {exporting ? 'Exporting…' : 'Export XLSX'}
          </button>
        </div>
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
            {paginated.map(order => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              «
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`px-3 py-1 rounded border text-sm transition-colors ${
                      page === p
                        ? 'bg-crystal-600 text-white border-crystal-600'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
