import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Stripe } from 'stripe';
import stripeClient, { verifyStripeWebhook, updateUserCredits } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Disable body parsing, as we need the raw body for webhook signature verification
export const dynamic = 'force-dynamic';
export const bodyParser = false;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = headers().get('stripe-signature');

        if (!signature) {
            console.log('[STRIPE_WEBHOOK] No signature provided');
            return new NextResponse('No signature', { status: 400 });
        }

        // Verify webhook signature
        const event = await verifyStripeWebhook(body, signature);
        console.log('[STRIPE_WEBHOOK] Event received:', event.type);

        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('[STRIPE_WEBHOOK] Checkout completed:', session.id);

                const userId = session.metadata?.userId;
                const tier = session.metadata?.tier as 'FREE' | 'PRO' | 'ENTERPRISE';

                if (!userId || !tier) {
                    throw new Error('Missing userId or tier in session metadata');
                }

                // Update user's credit allocation based on tier
                await updateUserCredits(userId, tier);
                console.log('[STRIPE_WEBHOOK] Credits updated for user:', userId, 'tier:', tier);
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('[STRIPE_WEBHOOK] Subscription event:', event.type, subscription.id);

                const userId = subscription.metadata.userId;
                if (!userId) {
                    throw new Error('No userId in subscription metadata');
                }

                // Determine the subscription tier
                const priceId = subscription.items.data[0].price.id;
                let tier: 'FREE' | 'PRO' | 'ENTERPRISE';
                
                // Map price IDs to tiers
                switch (priceId) {
                    case process.env.STRIPE_PRO_PRICE_ID:
                        tier = 'PRO';
                        break;
                    case process.env.STRIPE_ENTERPRISE_PRICE_ID:
                        tier = 'ENTERPRISE';
                        break;
                    default:
                        tier = 'FREE';
                }

                console.log('[STRIPE_WEBHOOK] Updating subscription for user:', userId, 'tier:', tier);

                // Update subscription in database
                await prisma.subscription.upsert({
                    where: {
                        stripeSubscriptionId: subscription.id
                    },
                    create: {
                        stripeSubscriptionId: subscription.id,
                        userId,
                        status: subscription.status,
                        priceId,
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        billingCycle: subscription.items.data[0].price.recurring?.interval || 'month'
                    },
                    update: {
                        status: subscription.status,
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                    }
                });

                // Update user's credit allocation based on tier
                await updateUserCredits(userId, tier);
                console.log('[STRIPE_WEBHOOK] Credits updated for subscription:', subscription.id);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('[STRIPE_WEBHOOK] Subscription deleted:', subscription.id);

                const userId = subscription.metadata.userId;
                if (!userId) {
                    throw new Error('No userId in subscription metadata');
                }

                // Update subscription status
                await prisma.subscription.update({
                    where: {
                        stripeSubscriptionId: subscription.id
                    },
                    data: {
                        status: subscription.status
                    }
                });

                // Revert to FREE tier
                await updateUserCredits(userId, 'FREE');
                console.log('[STRIPE_WEBHOOK] User reverted to FREE tier:', userId);
                break;
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[STRIPE_WEBHOOK] Error:', error);
        return new NextResponse(
            'Webhook error: ' + (error instanceof Error ? error.message : 'Unknown error'),
            { status: 400 }
        );
    }
}