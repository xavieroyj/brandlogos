'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import stripeClient, { updateUserCredits } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function verifyPayment(sessionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    console.log('[VERIFY_PAYMENT] Verifying session:', sessionId);

    // First retrieve the checkout session
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

    // Check if session has expired
    const expiresAt = new Date(checkoutSession.expires_at * 1000);
    if (expiresAt < new Date()) {
      throw new Error('This payment session has expired');
    }

    // Check if session was already processed
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          {
            stripeSubscriptionId: checkoutSession.subscription as string
          }
        ]
      }
    });

    if (existingSubscription) {
      throw new Error('This payment session has already been processed');
    }

    const isPaid = checkoutSession.payment_status === 'paid';
    const tier = checkoutSession.metadata?.tier as 'FREE' | 'PRO' | 'ENTERPRISE';

    // If payment is successful, update subscription and credits
    if (isPaid && tier) {
      try {
        // Only create subscription record if we have a subscription ID
        if (checkoutSession.subscription) {
          await prisma.subscription.create({
            data: {
              stripeSubscriptionId: checkoutSession.subscription as string,
              stripeSessionId: sessionId,
              userId: session.user.id,
              status: 'active',
              priceId: checkoutSession.line_items?.data[0]?.price?.id || '',
              currentPeriodEnd: new Date(checkoutSession.expires_at * 1000),
              billingCycle: 'monthly'
            }
          });
        }

        // Always update user credits
        await updateUserCredits(session.user.id, tier);
        console.log('[VERIFY_PAYMENT] Credits and subscription updated for user:', session.user.id, 'tier:', tier);
        
        // Revalidate the billing page
        revalidatePath('/dashboard/billing');
      } catch (updateError) {
        console.error('[VERIFY_PAYMENT] Failed to update credits or subscription:', updateError);
        // Continue even if update fails, as webhook will retry
      }
    }

    return {
      success: isPaid,
      tier: tier,
      status: checkoutSession.status
    };
  } catch (error) {
    console.error('[VERIFY_PAYMENT] Error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify payment status'
    };
  }
}
