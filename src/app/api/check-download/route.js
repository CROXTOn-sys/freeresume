import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Check if user has paid
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .single();

    if (payment) return NextResponse.json({ canDownload: true, isPaid: true, downloadCount: 0 });

    // Count existing downloads
    const { count } = await supabaseAdmin
      .from('saved_resumes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const downloadCount = count || 0;
    const canDownload = downloadCount < 1; // First download is free

    return NextResponse.json({ canDownload, isPaid: false, downloadCount });
  } catch (error) {
    return NextResponse.json({ error: 'Check failed' }, { status: 500 });
  }
}
