'use client'

import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore()
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-crystal-600" />
            <h2 className="font-serif text-xl font-semibold">Your Cart</h2>
            <span className="text-sm text-gray-500">({items.reduce((n, i) => n + i.quantity, 0)} items)</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 bg-crystal-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-crystal-300" />
              </div>
              <div>
                <p className="text-gray-600 font-medium mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add some crystals to start healing</p>
              </div>
              <button
                onClick={onClose}
                className="btn-primary text-sm py-2 px-5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="font-medium text-gray-900 text-sm hover:text-crystal-600 line-clamp-2 block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-crystal-600 font-semibold text-sm mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity control */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4">
            {/* Free shipping progress */}
            {subtotal < 125 && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Free US shipping at $125</span>
                  <span className="font-medium text-crystal-600">${(125 - subtotal).toFixed(2)} away</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-crystal-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((subtotal / 125) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= 125 && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                <span>🎉</span>
                <span>You qualify for free US shipping!</span>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-lg">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout</p>

            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-primary w-full text-center"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={onClose}
              className="w-full text-sm text-center text-gray-500 hover:text-crystal-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
