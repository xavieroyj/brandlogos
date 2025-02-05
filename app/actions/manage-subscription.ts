'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import stripeClient from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { SubscriptionTier } from '@prisma/client';

interface CreateCheckoutParams {
  tier: SubscriptionTier;
}

export async function createCheckoutSession({ tier }: CreateCheckoutParams) {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    // Get price ID based on tier
    const priceId = tier === 'PRO' 
      ? process.env.STRIPE_PRO_PRICE_ID 
      : process.env.STRIPE_ENTERPRISE_PRICE_ID;

    if (!priceId) {
      throw new Error('Invalid subscription tier');
    }

    console.log('[CREATE_CHECKOUT] Creating session for user:', session.user.id, 'tier:', tier);
    
    // Create Stripe checkout session
    const checkoutSession = await stripeClient.checkout.sessions.create({
      customer_email: session.user.email,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=canceled`,
      metadata: {
        userId: session.user.id,
        tier: tier,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          tier: tier,
        },
      },
    });

    console.log('[CREATE_CHECKOUT] Session created:', checkoutSession.id);

    return {
      url: checkoutSession.url,
    };
  } catch (error) {
    console.error('[CREATE_CHECKOUT_SESSION]', error);
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session?.user) {
      throw new Error('Unauthorized');
    }

    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    // Cancel at period end
    await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    return {
      message: 'Subscription will be canceled at the end of the billing period',
    };
  } catch (error) {
    console.error('[CANCEL_SUBSCRIPTION]', error);
    throw error;
  }
}