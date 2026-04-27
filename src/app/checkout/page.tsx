'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { COUNTRY_CODES } from '@/lib/shipping'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Truck, CreditCard } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { CheckoutFormData } from '@/types'

const checkoutSchema = z.object({
  email: z.string().email('Valid email required'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  address: z.string().min(5, 'Full address required'),
  address2: z.string().optional(),
  city: z.string().min(2, 'Required'),
  state: z.string().optional(),
  postalCode: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
  phone: z.string().optional(),
  shippingRateId: z.string().min(1, 'Please select a shipping method'),
})

interface ShippingOption {
  id: string
  name: string
  price: number
  minDays: number
  maxDays: number
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { items, clearCart } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalWeight = items.reduce((s, i) => s + i.weight * i.quantity, 0)

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [tax, setTax] = useState(0)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [placing, setPlacing] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email ?? '',
      country: 'US',
    },
  })

  const country = watch('country')
  const shippingRateId = watch('shippingRateId')

  useEffect(() => {
    if (!country) return
    setLoadingShipping(true)
    fetch('/api/shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, subtotal, weight: totalWeight }),
    })
      .then(r => r.json())
      .then(data => {
        setShippingOptions(data.options ?? [])
        setTax(data.tax ?? 0)
        if (data.options?.length > 0) {
          setSelectedShipping(data.options[0])
          setValue('shippingRateId', data.options[0].id)
        }
      })
      .finally(() => setLoadingShipping(false))
  }, [country, subtotal, totalWeight, setValue])

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return
    setPlacing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: data,
          shippingRateId: data.shippingRateId,
          email: data.email,
        }),
      })
      const result = await res.json()
      if (result.url) {
        window.location.href = result.url
      } else {
        toast.error(result.error || 'Could not process checkout')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  const shippingCost = selectedShipping?.price ?? 0
  const total = subtotal + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-xl">Your cart is empty</p>
        <Link href="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-crystal-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Contact Information
            </h2>
            <div>
              <label className="label">Email Address *</label>
              <input {...register('email')} type="email" className="input" placeholder="your@email.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-crystal-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input {...register('firstName')} className="input" placeholder="Jane" />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input {...register('lastName')} className="input" placeholder="Smith" />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="label">Country *</label>
                <select {...register('country')} className="input">
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Street Address *</label>
                <input {...register('address')} className="input" placeholder="123 Crystal Lane" />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="label">Apartment, suite, etc. (optional)</label>
                <input {...register('address2')} className="input" placeholder="Apt 4B" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <input {...register('city')} className="input" placeholder="New York" />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="label">State / Province</label>
                  <input {...register('state')} className="input" placeholder="NY" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Postal Code *</label>
                  <input {...register('postalCode')} className="input" placeholder="10001" />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
                </div>
                <div>
                  <label className="label">Phone (optional)</label>
                  <input {...register('phone')} className="input" placeholder="+1 555 000 0000" />
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Method */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-crystal-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
              Shipping Method
            </h2>
            {loadingShipping ? (
              <div className="flex items-center gap-3 py-4 text-gray-500">
                <div className="w-4 h-4 border-2 border-crystal-500 border-t-transparent rounded-full animate-spin" />
                Calculating shipping rates...
              </div>
            ) : shippingOptions.length === 0 ? (
              <div className="p-4 bg-yellow-50 rounded-xl text-sm text-yellow-700">
                Please select a country to see shipping options
              </div>
            ) : (
              <div className="space-y-3">
                {shippingOptions.map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingRateId === opt.id ? 'border-crystal-500 bg-crystal-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      value={opt.id}
                      {...register('shippingRateId')}
                      onChange={() => {
                        setValue('shippingRateId', opt.id)
                        setSelectedShipping(opt)
                      }}
                      className="text-crystal-600"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <Truck className="w-5 h-5 text-crystal-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{opt.name}</p>
                        <p className="text-sm text-gray-500">{opt.minDays}–{opt.maxDays} business days</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {opt.price === 0 ? <span className="text-green-600">FREE</span> : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
                {errors.shippingRateId && (
                  <p className="text-red-500 text-sm">{errors.shippingRateId.message}</p>
                )}
              </div>
            )}
          </section>

          {/* Payment (handled by Stripe) */}
          <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Secure Payment via Stripe</p>
              <p>You'll be redirected to Stripe's secure payment page. We accept Visa, Mastercard, Amex, and more.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="btn-primary w-full text-lg py-4"
          >
            <Lock className="w-5 h-5" />
            {placing ? 'Redirecting to payment...' : `Pay ${formatPrice(total)} securely`}
          </button>

          <p className="text-xs text-center text-gray-400">
            By placing your order, you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-28">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {items.map(item => {
                const imgs = JSON.parse('[]')
                return (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-crystal-600 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {selectedShipping
                    ? shippingCost === 0
                      ? <span className="text-green-600">FREE</span>
                      : formatPrice(shippingCost)
                    : '—'}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (VAT)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Secure badges */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span>SSL Encrypted • Powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
