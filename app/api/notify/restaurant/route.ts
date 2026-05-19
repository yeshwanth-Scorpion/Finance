import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSMS, getNewOrderMessage } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const { orderId, businessId } = await request.json()

    if (!orderId || !businessId) {
      return NextResponse.json({ error: 'Missing orderId or businessId' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch the order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Fetch the business with manager phone
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('name, manager_phone')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    if (!business.manager_phone) {
      return NextResponse.json({ error: 'No manager phone configured' }, { status: 400 })
    }

    // Get order item count
    const { count } = await supabase
      .from('order_items')
      .select('*', { count: 'exact', head: true })
      .eq('order_id', orderId)

    // Send SMS to restaurant manager
    const message = getNewOrderMessage({
      orderId: order.id,
      customerName: order.customer_name || 'Customer',
      customerPhone: order.customer_phone || 'Not provided',
      isPriority: order.is_priority || false,
      pickupTime: order.pickup_time,
      totalAmount: order.total_amount,
      itemCount: count || 0,
    })

    const result = await sendSMS({
      to: business.manager_phone,
      message,
    })

    return NextResponse.json({ success: result.success, error: result.error })
  } catch (error) {
    console.error('[v0] Notify restaurant error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
