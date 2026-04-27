import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderNumber = session.metadata?.orderNumber

        if (!orderNumber) break

        await prisma.order.update({
          where: { orderNumber },
          data: {
            status: 'paid',
            paymentStatus: 'paid',
            stripePaymentId: session.payment_intent as string,
          },
        })

        // Reduce stock
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

        console.log(`✅ Order ${orderNumber} paid successfully`)
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', pi.id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          await prisma.order.updateMany({
            where: { stripePaymentId: charge.payment_intent as string },
            data: { paymentStatus: 'refunded', status: 'refunded' },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const config = {
  api: { bodyParser: false },
}
