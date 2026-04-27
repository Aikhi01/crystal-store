'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'badge-yellow',
  paid: 'badge-green',
  processing: 'badge-purple',
  shipped: 'badge bg-blue-100 text-blue-700',
  delivered: 'badge-green',
  cancelled: 'badge-red',
  refunded: 'badge bg-gray-100 text-gray-700',
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/orders')
        .then(r => r.json())
        .then(data => { setOrders(data); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [session])

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-crystal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">My Orders</h1>
        <Link href="/products" className="btn-secondary text-sm py-2">Continue Shopping</Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const isExpanded = expandedOrder === order.id
            const statusStyle = STATUS_STYLES[order.status as OrderStatus] ?? 'badge bg-gray-100 text-gray-600'

            return (
              <div key={order.id} className="card">
                {/* Order header */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-crystal-50 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-crystal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'MMM d, yyyy')} · {order.items.length} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <span className={statusStyle}>{order.status}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5">
                    <div className="space-y-3 mb-4">
                      {order.items.map((item: any) => {
                        const images = item.product?.images ? JSON.parse(item.product.images) : []
                        return (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {images[0] && <Image src={images[0]} alt={item.name} fill className="object-cover" />}
                            </div>
                            <div className="flex-1">
                              <Link
                                href={`/products/${item.product?.slug ?? '#'}`}
                                className="text-sm font-medium text-gray-900 hover:text-crystal-600"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span>{formatPrice(order.tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <p><strong>Ship to:</strong> {order.shippingName}, {order.shippingLine1}, {order.shippingCity}, {order.shippingCountry}</p>
                    </div>

                    {order.trackingNumber && (
                      <a
                        href={order.trackingUrl ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-crystal-600 hover:underline"
                      >
                        Track Package: {order.trackingNumber}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
