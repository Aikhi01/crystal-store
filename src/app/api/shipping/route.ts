export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getShippingOptions, calculateTax } from '@/lib/shipping'

export async function POST(request: Request) {
  try {
    const { country, subtotal, weight } = await request.json()

    if (!country) {
      return NextResponse.json({ error: 'Country is required' }, { status: 400 })
    }

    const options = await getShippingOptions(country, subtotal ?? 0, weight ?? 0)
    const tax = calculateTax(subtotal ?? 0, country)

    return NextResponse.json({ options, tax })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
