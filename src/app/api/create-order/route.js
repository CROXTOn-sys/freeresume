import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if already paid
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .single();

    if (payment) return NextResponse.json({ error: 'Already paid', alreadyPaid: true }, { status: 400 });

    // Create Razorpay order for ₹19
    const order = await razorpay.orders.create({
      amount: 1900, // ₹19 in paise
      currency: 'INR',
      receipt: `resume_${user.id.slice(0, 8)}_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    console.error('[create-order] error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
