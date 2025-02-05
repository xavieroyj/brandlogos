import Stripe from 'stripe';
import { prisma } from './prisma';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

// Stripe client singleton
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia', // Use latest stable API version
});

// Credit limits by tier
export const CREDIT_LIMITS = {
  FREE: 5,
  PRO: 20,
  ENTERPRISE: 50,
} as const;

// Helper function to verify Stripe webhook signature
export async function verifyStripeWebhook(payload: string | Buffer, signature: string) {
  try {
    return await stripeClient.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('[STRIPE_VERIFY_WEBHOOK]', err);
    throw err;
  }
}

// Update user credits based on subscription tier
export async function updateUserCredits(userId: string, tier: 'FREE' | 'PRO' | 'ENTERPRISE') {
  try {
    console.log('[UPDATE_CREDITS] Updating credits for user:', userId, 'to tier:', tier);

    // Get the credit limit for the tier
    const dailyCredits = CREDIT_LIMITS[tier];
    const monthlyCredits = tier === 'FREE' ? 500 : tier === 'PRO' ? 1000 : 2000;

    // Use transaction to ensure atomic updates
    const result = await prisma.$transaction(async (tx) => {
      const updatedCredit = await tx.credit.upsert({
        where: { userId },
        create: {
          userId,
          tier,
          dailyCredits,
          monthlyCredits,
          usedCredits: 0,
          resetDate: new Date(new Date().setHours(23, 59, 59, 999)),
          updateStatus: 'COMPLETED'
        },
        update: {
          tier,
          dailyCredits,
          monthlyCredits,
          usedCredits: 0, // Reset credits on tier change
          resetDate: new Date(new Date().setHours(23, 59, 59, 999)),
          updateStatus: 'COMPLETED'
        }
      });

      // Log the update
      await tx.creditUpdateLog.create({
        data: {
          creditId: updatedCredit.id,
          tier,
          status: 'COMPLETED'
        }
      });

      return updatedCredit;
    });

    console.log('[UPDATE_CREDITS] Successfully updated credits:', {
      userId,
      tier,
      dailyCredits,
      monthlyCredits,
      usedCredits: result.usedCredits,
      resetDate: result.resetDate,
      status: result.updateStatus
    });

    return result;
  } catch (err) {
    console.error('[STRIPE_UPDATE_CREDITS] Error:', err);

    // Update status to FAILED if credit record exists
    try {
      await prisma.credit.update({
        where: { userId },
        data: { updateStatus: 'FAILED' }
      });
    } catch (updateErr) {
      console.error('[STRIPE_UPDATE_CREDITS] Failed to update status:', updateErr);
    }

    throw err;
  }
}

export default stripeClient;
