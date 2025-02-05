'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import stripeClient from '@/lib/stripe';

export async function verifyPayment(sessionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    console.log('[VERIFY_PAYMENT] Verifying session:', sessionId);

    // Verify the checkout session
    const checkoutSession = await stripeClient.checkout.sessions.retrieve(
      sessionId
    );

    console.log('[VERIFY_PAYMENT] Session retrieved:', {
      sessionId: checkoutSession.id,
      paymentStatus: checkoutSession.payment_status,
      userId: checkoutSession.metadata?.userId,
      tier: checkoutSession.metadata?.tier
    });

    if (checkoutSession.metadata?.userId !== session.user.id) {
      throw new Error('Session does not belong to current user');
    }

    return {
      success: checkoutSession.payment_status === 'paid',
      tier: checkoutSession.metadata?.tier,
      status: checkoutSession.status
    };
  } catch (error) {
    console.error('[VERIFY_PAYMENT] Error:', error);
    return { success: false };
  }
}