import type { Product, Category, Order, OrderItem, User, Review } from '@prisma/client'

export type ProductWithCategory = Product & {
  category: Category
  reviews?: Review[]
}

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
  })[]
  user?: User | null
}

export interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  address2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
  shippingRateId: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// NextAuth augmentation
import type { DefaultSession, DefaultUser } from 'next-auth'
import type { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role: string
    }
  }
  interface User extends DefaultUser {
    role: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string
  }
}
