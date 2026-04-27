import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { items, shippingAddress, shippingRateId, email } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Validate products and get current prices
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Some products are no longer available' }, { status: 400 })
    }

    // Get shipping rate
    const shippingRate = await prisma.shippingRate.findUnique({
      where: { id: shippingRateId },
      include: { zone: true },
    })

    if (!shippingRate) {
      return NextResponse.json({ error: 'Invalid shipping option' }, { status: 400 })
    }

    // Build line items
    const lineItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId)!
      const productImages: string[] = JSON.parse(product.images)
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: productImages.slice(0, 1),
            metadata: { productId: product.id },
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      }
    })

    // Calculate subtotal
    const subtotal = products.reduce((sum, p) => {
      const item = items.find((i: any) => i.productId === p.id)
      return sum + p.price * (item?.quantity ?? 1)
    }, 0)

    // Shipping cost (0 if free above threshold)
    const shippingCost = shippingRate.freeAbove && subtotal >= shippingRate.freeAbove
      ? 0
      : shippingRate.price

    const orderNumber = generateOrderNumber()

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: session?.user?.email ?? email,
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(shippingCost * 100), currency: 'usd' },
            display_name: shippingRate.name,
            delivery_estimate: {
              minimum: { unit: 'business_day', value: shippingRate.minDays },
              maximum: { unit: 'business_day', value: shippingRate.maxDays },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true`,
      metadata: {
        orderNumber,
        userId: session?.user?.id ?? '',
        guestEmail: email ?? '',
        shippingName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        shippingLine1: shippingAddress.address,
        shippingLine2: shippingAddress.address2 ?? '',
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state ?? '',
        shippingPostal: shippingAddress.postalCode,
        shippingCountry: shippingAddress.country,
      },
    })

    // Create pending order in DB
    await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id ?? null,
        guestEmail: email ?? null,
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: 'stripe',
        stripeSessionId: checkoutSession.id,
        subtotal,
        shipping: shippingCost,
        tax: 0,
        total: subtotal + shippingCost,
        currency: 'USD',
        shippingName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        shippingLine1: shippingAddress.address,
        shippingLine2: shippingAddress.address2 ?? null,
        shippingCity: shippingAddress.city,
        shippingState: shippingAddress.state ?? null,
        shippingPostal: shippingAddress.postalCode,
        shippingCountry: shippingAddress.country,
        items: {
          create: items.map((item: any) => {
            const product = products.find(p => p.id === item.productId)!
            const imgs: string[] = JSON.parse(product.images)
            return {
              productId: product.id,
              quantity: item.quantity,
              price: product.price,
              name: product.name,
              image: imgs[0] ?? null,
            }
          }),
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
