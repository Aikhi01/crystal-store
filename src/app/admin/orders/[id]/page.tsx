'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod?: string
  stripeSessionId?: string
  stripePaymentId?: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  shippingName: string
  shippingLine1: string
  shippingLine2?: string
  shippingCity: string
  shippingState?: string
  shippingPostal: string
  shippingCountry: string
  trackingNumber?: string
  trackingUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: { name?: string; email: string }
  guestEmail?: string
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { toast.error(data.error); return }
        setOrder(data)
        setNewStatus(data.status)
        setTrackingNumber(data.trackingNumber ?? '')
        setTrackingUrl(data.trackingUrl ?? '')
        setNotes(data.notes ?? '')
      })
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingNumber, trackingUrl, notes }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Update failed'); return }
      setOrder(data)
      toast.success('Order updated successfully')
    } catch {
      toast.error('Update failed')
    } finally {
      setUpdating(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-crystal-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Order not found.</p>
        <Link href="/admin/orders" className="btn-primary mt-4 inline-block">Back to Orders</Link>
      </div>
    )
  }

  const customerName = order.user?.name ?? order.shippingName
  const customerEmail = order.user?.email ?? order.guestEmail

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy · h:mm a')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order Items */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h2>
            <div className="divide-y divide-gray-100">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update Order */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Order</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="input"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 1Z999AA10123456784"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking URL</label>
                <input
                  type="text"
                  value={trackingUrl}
                  onChange={e => setTrackingUrl(e.target.value)}
                  placeholder="https://tracking.example.com/..."
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this order..."
                  className="input resize-none"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn-primary w-full"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Customer */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Customer</h2>
            <p className="font-medium text-gray-900">{customerName}</p>
            <p className="text-sm text-gray-500">{customerEmail}</p>
            {order.user ? (
              <span className="inline-block mt-2 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Registered</span>
            ) : (
              <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Guest</span>
            )}
          </div>

          {/* Shipping Address */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <address className="not-italic text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{order.shippingName}</p>
              <p>{order.shippingLine1}</p>
              {order.shippingLine2 && <p>{order.shippingLine2}</p>}
              <p>{order.shippingCity}{order.shippingState ? `, ${order.shippingState}` : ''} {order.shippingPostal}</p>
              <p>{order.shippingCountry}</p>
            </address>
          </div>

          {/* Payment Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium capitalize">{order.paymentMethod ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
              {order.stripeSessionId && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-400 text-xs mb-1">Stripe Session</p>
                  <p className="font-mono text-xs text-gray-600 break-all">{order.stripeSessionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tracking */}
          {(order.trackingNumber || order.trackingUrl) && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Tracking</h2>
              {order.trackingNumber && (
                <p className="font-mono text-sm text-gray-700">{order.trackingNumber}</p>
              )}
              {order.trackingUrl && (
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer"
                  className="text-crystal-600 text-sm hover:underline mt-1 inline-block">
                  Track Package →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
