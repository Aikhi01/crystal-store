'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Truck, Mail, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

interface Order {
  orderNumber: string
  total: number
  items: OrderItem[]
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCartStore(s => s.clearCart)

  const [verifying, setVerifying] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    clearCart()

    if (!sessionId) {
      setVerifying(false)
      return
    }

    fetch('/api/orders/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.order) {
          setOrder(data.order)
        } else {
          setError(data.error ?? 'Could not confirm order')
        }
      })
      .catch(() => setError('Network error. Your order may still be processing.'))
      .finally(() => setVerifying(false))
  }, [sessionId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          {verifying
            ? <Loader2 className="w-12 h-12 text-green-400 animate-spin" />
            : <CheckCircle className="w-14 h-14 text-green-500" />
          }
        </div>
        {!verifying && (
          <>
            <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
            <div className="absolute -bottom-1 -left-2 text-2xl animate-bounce delay-100">💜</div>
          </>
        )}
      </div>

      <div className="text-center max-w-lg w-full">
        {verifying ? (
          <>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Confirming your order...</h1>
            <p className="text-gray-500">Please wait while we confirm your payment.</p>
          </>
        ) : error ? (
          <>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Payment Received</h1>
            <p className="text-gray-500 mb-4">Your payment was successful. There was a small delay confirming your order — it will appear in your account shortly.</p>
            <p className="text-sm text-red-400 mb-6">{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-1">Thank you for your purchase 🙏</p>
            {order && <p className="text-sm text-crystal-600 font-medium mb-2">Order #{order.orderNumber}</p>}
            <p className="text-gray-500 mb-6">Your healing crystals are on their way. You'll receive a confirmation email shortly.</p>
          </>
        )}

        {order && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 text-left shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Order Summary</h2>
            <div className="space-y-2 mb-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}

        {!verifying && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 text-left shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4 text-center">What happens next?</h2>
            <div className="space-y-4">
              {[
                { icon: Mail, text: 'Confirmation email sent to your inbox', done: true },
                { icon: Package, text: 'Your order is being carefully packaged (1–2 business days)', done: false },
                { icon: Truck, text: 'Shipped with tracking number', done: false },
                { icon: Sparkles, text: 'Your crystals arrive, ready to heal!', done: false },
              ].map(({ icon: Icon, text, done }) => (
                <div key={text} className={`flex items-start gap-3 ${done ? 'text-green-700' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm pt-1.5">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!verifying && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/orders" className="btn-primary">View My Orders</Link>
            <Link href="/products" className="btn-secondary">Continue Shopping</Link>
          </div>
        )}

        {!verifying && (
          <div className="mt-10 p-4 bg-crystal-50 rounded-xl text-sm text-crystal-700">
            <p className="font-medium mb-1">✨ Crystal Care Tip</p>
            <p>When your bracelet arrives, cleanse it under running water and set your intention while holding it. This activates its healing energy for you personally.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-crystal-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your order...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
