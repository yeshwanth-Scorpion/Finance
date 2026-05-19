import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE_NUMBER

// Initialize Twilio client only if credentials are available
const client = accountSid && authToken ? twilio(accountSid, authToken) : null

interface SMSOptions {
  to: string
  message: string
}

export async function sendSMS({ to, message }: SMSOptions): Promise<{ success: boolean; error?: string }> {
  if (!client || !twilioPhone) {
    console.log('[v0] SMS not configured - would send to:', to, 'message:', message)
    return { success: false, error: 'SMS not configured' }
  }

  try {
    // Format Australian phone numbers
    let formattedPhone = to.replace(/\s/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+61' + formattedPhone.slice(1)
    }
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+61' + formattedPhone
    }

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedPhone,
    })

    return { success: true }
  } catch (error) {
    console.error('[v0] SMS send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Notification templates
export function getNewOrderMessage(orderDetails: {
  orderId: string
  customerName: string
  customerPhone: string
  isPriority: boolean
  pickupTime: string
  totalAmount: string
  itemCount: number
}): string {
  const priorityFlag = orderDetails.isPriority ? '🚛 TRUCKIE PRIORITY\n' : ''
  return `${priorityFlag}NEW ORDER #${orderDetails.orderId.slice(0, 8)}

Customer: ${orderDetails.customerName}
Phone: ${orderDetails.customerPhone}
Pickup: ${new Date(orderDetails.pickupTime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
Items: ${orderDetails.itemCount}
Total: $${orderDetails.totalAmount}

Log in to RuralsyncAI dashboard to confirm.`
}

export function getOrderReadyMessage(orderDetails: {
  orderId: string
  businessName: string
  customerName: string
}): string {
  return `G'day ${orderDetails.customerName}!

Your order #${orderDetails.orderId.slice(0, 8)} at ${orderDetails.businessName} is READY for pickup.

Skip the queue and grab it from the counter.

Thanks for using RuralsyncAI!`
}

export function getOrderConfirmedMessage(orderDetails: {
  orderId: string
  businessName: string
  customerName: string
  pickupTime: string
}): string {
  return `G'day ${orderDetails.customerName}!

Your order #${orderDetails.orderId.slice(0, 8)} at ${orderDetails.businessName} has been CONFIRMED.

We're preparing it now for pickup at ${new Date(orderDetails.pickupTime).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}.

We'll text you when it's ready!`
}
