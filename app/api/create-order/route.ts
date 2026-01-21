import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { credits, amount } = await req.json();
    console.log('📦 Create Order Request:', { credits, amount });

    // Validate inputs
    if (!credits || !amount) {
      console.error('❌ Missing credits or amount');
      return Response.json({ error: 'Credits and amount are required' }, { status: 400 });
    }

    // Validate user authentication
    const supabase = await createSupabaseServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    console.log('🔐 Auth Check:', {
      hasSession: !!session,
      userId: session?.user?.id,
      error: sessionError?.message
    });

    if (sessionError || !session) {
      console.error('❌ Unauthorized:', sessionError);
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Missing Razorpay credentials');
      return Response.json({
        error: 'Payment gateway not configured. Please contact support.'
      }, { status: 500 });
    }

    console.log('💳 Razorpay Config:', {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      keyIdPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 8)
    });

    // Initialize Razorpay instance
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const options = {
      amount: amount, // Amount is in paise (smallest currency unit)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`, // Shortened to fit 40 char limit
    };

    console.log('🎫 Creating Razorpay order with options:', options);

    const order = await razorpay.orders.create(options);

    console.log('✅ Order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

    return Response.json({ order });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      name: (error as Error).name
    });

    return Response.json({
      error: (error as Error).message || 'Failed to create order. Please try again.'
    }, { status: 500 });
  }
}