export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Called by Vercel Cron every 10 minutes.
// Cancels pending orders that have been unpaid for more than 1 hour.
export async function GET(request: Request) {
  // Verify the request comes from Vercel Cron (or internal calls)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  try {
    const result = await prisma.order.updateMany({
      where: {
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: { lt: oneHourAgo },
      },
      data: {
        status: 'cancelled',
      },
    })

    console.log(`[cron] Auto-cancelled ${result.count} expired pending orders`)

    return NextResponse.json({
      success: true,
      cancelledCount: result.count,
      cutoff: oneHourAgo.toISOString(),
    })
  } catch (error: any) {
    console.error('[cron] cancel-pending-orders error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
