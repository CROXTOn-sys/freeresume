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

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });

    // Verify payment status with Cashfree
    const response = await fetch(`${CASHFREE_API_URL}/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
    });

    const orderData = await response.json();

    if (!response.ok || orderData.order_status !== 'PAID') {
      return NextResponse.json({ error: 'Payment not completed', status: orderData.order_status }, { status: 400 });
    }

    // Save payment record
    const { error } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: user.id,
        order_id: orderId,
        payment_id: orderData.cf_order_id || orderId,
        amount: 1900,
        status: 'paid',
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, paid: true });
  } catch (error) {
    console.error('[verify-payment] error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
