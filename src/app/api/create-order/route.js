import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CASHFREE_API_URL = 'https://api.cashfree.com/pg/orders';

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

    const orderId = `order_${user.id.slice(0, 8)}_${Date.now()}`;

    // Create Cashfree order
    const response = await fetch(CASHFREE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: 2,
        order_currency: 'INR',
        customer_details: {
          customer_id: user.id.slice(0, 20),
          customer_email: user.email || 'user@resumelab.com',
          customer_phone: '9999999999',
        },
        order_meta: {
          return_url: `${request.headers.get('origin') || 'http://localhost:3000'}/api/verify-payment?order_id=${orderId}`,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[create-order] Cashfree error:', data);
      return NextResponse.json({ error: 'Failed to create order', details: data }, { status: 500 });
    }

    return NextResponse.json({
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      amount: 19,
    });
  } catch (error) {
    console.error('[create-order] error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
