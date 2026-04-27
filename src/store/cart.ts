'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
  weight: number
}

interface CartState {
  items: CartItem[]
  currency: string
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setCurrency: (currency: string) => void
  get subtotal(): number
  get totalWeight(): number
  get totalItems(): number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'USD',

      addItem: (item) => {
        const existing = get().items.find(i => i.productId === item.productId)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }))
        } else {
          set(state => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }))
        }
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(i => i.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      setCurrency: (currency) => set({ currency }),

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },

      get totalWeight() {
        return get().items.reduce((sum, i) => sum + i.weight * i.quantity, 0)
      },

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    {
      name: 'crystal-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
