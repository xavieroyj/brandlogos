'use client';

import { useState } from 'react';
import { SubscriptionTier } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/app/actions/manage-subscription';

interface SubscriptionButtonProps {
  currentTier: SubscriptionTier;
  targetTier: SubscriptionTier;
}

export function SubscriptionButton({ currentTier, targetTier }: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      
      // Handle downgrade to FREE tier
      if (targetTier === 'FREE') {
        // TODO: Implement cancellation flow
        return;
      }

      // Create checkout session for upgrades
      const { url } = await createCheckoutSession({
        tier: targetTier,
      });

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // TODO: Add proper error toast
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan = currentTier === targetTier;
  const isUpgrade = targetTier !== 'FREE';

  return (
    <Button
      className="w-full"
      variant={isUpgrade ? "default" : "secondary"}
      disabled={isCurrentPlan || loading}
      onClick={handleSubscription}
    >
      {loading ? (
        <span>Loading...</span>
      ) : isCurrentPlan ? (
        'Current Plan'
      ) : targetTier === 'FREE' ? (
        'Downgrade'
      ) : (
        `Upgrade to ${targetTier}`
      )}
    </Button>
  );
}