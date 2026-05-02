export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const orderNumber = searchParams.get('orderNumber')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://isle-of-mist.com'

    if (!token || !orderNumber) {
      return Response.redirect(`${siteUrl}/checkout?cancelled=true`)
    }

    const base = process.env.PAYPAL_BASE_URL ?? 'https://api-m.paypal.com'
    const accessToken = await getPayPalAccessToken()

    const captureRes = await fetch(`${base}/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const captureData = await captureRes.json()

    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      console.error('PayPal capture failed:', captureData)
      return Response.redirect(`${siteUrl}/checkout?cancelled=true`)
    }

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id

    await prisma.order.update({
      where: { orderNumber },
      data: {
        status: 'paid',
        paymentStatus: 'paid',
        stripePaymentId: captureId ?? token,
      },
    })

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })

    if (order) {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }
    }

    return Response.redirect(`${siteUrl}/order/success?provider=paypal&orderNumber=${orderNumber}`)
  } catch (error: any) {
    console.error('PayPal capture error:', error)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://isle-of-mist.com'
    return Response.redirect(`${siteUrl}/checkout?cancelled=true`)
  }
}
