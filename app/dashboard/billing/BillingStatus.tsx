'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyPayment } from '@/app/actions/verify-payment';

export function BillingStatus() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);

  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    async function verify() {
      if (sessionId) {
        setVerifying(true);
        try {
          const result = await verifyPayment(sessionId);
          if (result.success) {
            toast({
              title: 'Payment Successful',
              description: `Your subscription has been upgraded to ${result.tier}. Please refresh to see your new credits.`,
              variant: 'default',
            });
          } else {
            toast({
              title: 'Payment Verification Failed',
              description: 'There was an issue verifying your payment. Please contact support.',
              variant: 'destructive',
            });
          }
        } catch {
          toast({
            title: 'Error',
            description: 'Failed to verify payment status.',
            variant: 'destructive',
          });
        } finally {
          setVerifying(false);
        }
      } else if (status === 'canceled') {
        toast({
          title: 'Checkout Canceled',
          description: 'You have canceled the checkout process.',
          variant: 'default',
        });
      }
    }

    verify();
  }, [sessionId, status, toast]);

  if (verifying) {
    return (
      <div className="w-full p-4 mb-4 text-center bg-muted">
        Verifying payment status...
      </div>
    );
  }

  return null;
}
