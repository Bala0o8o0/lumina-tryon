import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, credits } = await req.json();

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !credits) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Validate user authentication
    const supabase = await createSupabaseServerClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session || session.user.id !== userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user credits to calculate new amount
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError) {
      throw userError;
    }

    // Update user credits in the database
    const { error: creditError } = await supabase
      .from('users')
      .update({
        credits: userData.credits + credits
      })
      .eq('id', userId);

    if (creditError) {
      throw creditError;
    }

    // Record the purchase in the purchases table
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        credits_added: credits,
        payment_id: razorpay_payment_id,
      });

    if (purchaseError) {
      throw purchaseError;
    }

    return Response.json({
      success: true,
      message: 'Payment verified and credits added successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return Response.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}