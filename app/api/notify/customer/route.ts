import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSMS, getOrderReadyMessage, getOrderConfirmedMessage } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const { orderId, notificationType } = await request.json()

    if (!orderId || !notificationType) {
      return NextResponse.json({ error: 'Missing orderId or notificationType' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch the order details with business info
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        businesses:business_id (name)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.customer_phone) {
      return NextResponse.json({ error: 'No customer phone on order' }, { status: 400 })
    }

    let message: string

    if (notificationType === 'ready') {
      message = getOrderReadyMessage({
        orderId: order.id,
        businessName: order.businesses?.name || 'the restaurant',
        customerName: order.customer_name || 'mate',
      })
    } else if (notificationType === 'confirmed') {
      message = getOrderConfirmedMessage({
        orderId: order.id,
        businessName: order.businesses?.name || 'the restaurant',
        customerName: order.customer_name || 'mate',
        pickupTime: order.pickup_time,
      })
    } else {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    const result = await sendSMS({
      to: order.customer_phone,
      message,
    })

    return NextResponse.json({ success: result.success, error: result.error })
  } catch (error) {
    console.error('[v0] Notify customer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
