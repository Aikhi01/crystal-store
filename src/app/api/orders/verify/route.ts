import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// Called from success page to confirm payment and update order status
export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()
    if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed', status: session.payment_status }, { status: 402 })
    }

    const orderNumber = session.metadata?.orderNumber
    if (!orderNumber) return NextResponse.json({ error: 'Order number not found' }, { status: 400 })

    // Find the order
    const existing = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })

    if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Only update if still pending (idempotent)
    if (existing.status === 'pending' || existing.paymentStatus === 'unpaid') {
      await prisma.order.update({
        where: { orderNumber },
        data: {
          status: 'paid',
          paymentStatus: 'paid',
          stripePaymentId: session.payment_intent as string,
        },
      })

      // Reduce stock
      for (const item of existing.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }
    }

    // Return order info for display
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
