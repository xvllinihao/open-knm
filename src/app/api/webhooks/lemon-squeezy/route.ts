import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    if (!secret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');

    if (signature !== digest) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data;

    // Only handle order_created for now (or subscription_created if using subscriptions)
    if (eventName === 'order_created') {
      const userId = customData?.user_id;

      if (!userId) {
        console.error('No user_id found in custom_data');
        return NextResponse.json({ error: 'No user_id found' }, { status: 200 }); // Still return 200 to acknowledge receipt
      }

      // Update user to pro in Supabase
      const supabase = createAdminClient();
      const { error } = await supabase
        .from('profiles')
        .update({ 
          tier: 'pro',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user tier:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook error:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

