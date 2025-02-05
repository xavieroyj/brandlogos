'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import stripeClient, { updateUserCredits } from '@/lib/stripe';

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

    const isPaid = checkoutSession.payment_status === 'paid';
    const tier = checkoutSession.metadata?.tier as 'FREE' | 'PRO' | 'ENTERPRISE';

    // If payment is successful, update credits immediately
    if (isPaid && tier) {
      try {
        await updateUserCredits(session.user.id, tier);
        console.log('[VERIFY_PAYMENT] Credits updated for user:', session.user.id, 'tier:', tier);
      } catch (updateError) {
        console.error('[VERIFY_PAYMENT] Failed to update credits:', updateError);
        // Continue even if credit update fails, as webhook will retry
      }
    }

    return {
      success: isPaid,
      tier: tier,
      status: checkoutSession.status
    };
  } catch (error) {
    console.error('[VERIFY_PAYMENT] Error:', error);
    return { success: false };
  }
}
