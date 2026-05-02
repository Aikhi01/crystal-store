export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  const base = process.env.PAYPAL_BASE_URL ?? 'https://api-m.paypal.com'

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error_description ?? 'Failed to get PayPal token')
  return data.access_token
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { items, shippingAddress, shippingRateId, email } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })
    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Some products are no longer available' }, { status: 400 })
    }

    const shippingRate = await prisma.shippingRate.findUnique({
      where: { id: shippingRateId },
    })
    if (!shippingRate) {
      return NextResponse.json({ error: 'Invalid shipping option' }, { status: 400 })
    }

    const subtotal = products.reduce((sum, p) => {
      const item = items.find((i: any) => i.productId === p.id)
      return sum + p.price * (item?.quantity ?? 1)
    }, 0)

    const shippingCost = shippingRate.freeAbove && subtotal >= shippingRate.freeAbove
      ? 0
      : shippingRate.price

    const total = subtotal + shippingCost
    const orderNumber = generateOrderNumber()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://isle-of-mist.com'
    const base = process.env.PAYPAL_BASE_URL ?? 'https://api-m.paypal.com'

    const accessToken = await getPayPalAccessToken()

    const ppItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId)!
      return {
        name: product.name,
        quantity: String(item.quantity),
        unit_amount: { currency_code: 'USD', value: product.price.toFixed(2) },
      }
    })

    const ppRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderNumber,
            amount: {
              currency_code: 'USD',
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: 'USD', value: subtotal.toFixed(2) },
                shipping: { currency_code: 'USD', value: shippingCost.toFixed(2) },
              },
            },
            items: ppItems,
          },
        ],
        application_context: {
          return_url: `${siteUrl}/api/webhooks/paypal?orderNumber=${orderNumber}`,
          cancel_url: `${siteUrl}/checkout?cancelled=true`,
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    })

    const ppData = await ppRes.json()
    if (!ppRes.ok) {
      console.error('PayPal order error:', ppData)
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
    }

    const approveLink = ppData.links?.find((l: any) => l.rel === 'approve')?.href
    if (!approveLink) {
      return NextResponse.json({ error: 'No approve URL from PayPal' }, { status: 500 })
    }

    await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id ?? null,
        guestEmail: email ?? null,
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod: 'paypal',
        stripeSessionId: ppData.id,
        subtotal,
        shipping: shippingCost,
        tax: 0,
        total,
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

    return NextResponse.json({ url: approveLink })
  } catch (error: any) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
