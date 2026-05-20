import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { createAdminClient } from "@/lib/supabase/admin";

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
    
    // Initialize Supabase admin client to fetch order items
    const supabase = createAdminClient();
    
    // Fetch order items with menu item names
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        quantity,
        unit_price,
        special_instructions,
        menu_items (
          name,
          description
        )
      `)
      .eq("order_id", order.id);

    if (itemsError) {
      console.error("[v0] Error fetching order items:", itemsError);
    }

    // Format items list for kitchen
    let itemsList = "No items found";
    if (orderItems && orderItems.length > 0) {
      itemsList = orderItems
        .map((item: any) => {
          const menuItem = item.menu_items;
          const name = menuItem?.name || "Unknown item";
          const qty = item.quantity || 1;
          const instructions = item.special_instructions 
            ? `\n   Note: ${item.special_instructions}` 
            : "";
          return `- ${qty}x ${name}${instructions}`;
        })
        .join("\n");
    }

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

    // Format the SMS message with items for kitchen
    const message = `🍳 KITCHEN ORDER #${order.id?.slice(0, 8)}

Customer: ${order.customer_name || "Unknown"}
Type: ${order.order_type || "Dine-in"}
${order.table_number ? `Table: ${order.table_number}` : ""}

ITEMS TO PREPARE:
${itemsList}

Total: $${order.total_amount || 0}
${order.notes ? `\nOrder Notes: ${order.notes}` : ""}`;

    // Send SMS to the business owner
    const businessOwnerPhone = "+61457089774";

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: businessOwnerPhone,
    });

    console.log("[v0] Kitchen SMS sent for order:", order.id);

    return NextResponse.json({ 
      success: true, 
      message: "Kitchen notification sent" 
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
