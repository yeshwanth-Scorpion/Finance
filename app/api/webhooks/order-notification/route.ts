import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// This endpoint is called by Supabase webhook when a new order is created
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Supabase webhook sends data in this format
    const { record, type } = payload;
    
    // Only process INSERT events (new orders)
    if (type !== "INSERT") {
      return NextResponse.json({ message: "Ignored non-insert event" });
    }

    const order = record;
    
    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !twilioPhone) {
      console.error("[v0] Missing Twilio credentials");
      return NextResponse.json(
        { error: "Twilio not configured" },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Format the SMS message
    const message = `New Order! 
Customer: ${order.customer_name || "Unknown"}
Amount: $${order.total_amount || 0}
Order ID: ${order.id}
Status: ${order.status || "pending"}`;

    // Send SMS to the business owner
    // The phone number is stored in the profile, but for simplicity we use the known number
    const businessOwnerPhone = "+61457089774";

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: businessOwnerPhone,
    });

    console.log("[v0] SMS sent successfully for order:", order.id);

    return NextResponse.json({ 
      success: true, 
      message: "SMS notification sent" 
    });
  } catch (error) {
    console.error("[v0] Error sending SMS:", error);
    return NextResponse.json(
      { error: "Failed to send SMS notification" },
      { status: 500 }
    );
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Order notification webhook is active" 
  });
}
