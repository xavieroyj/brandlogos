'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyPayment } from '@/app/actions/verify-payment';

export function BillingStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const processed = useRef(false);

  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && !processed.current) {
      processed.current = true;
      verifyPayment(sessionId)
        .then((result) => {
          if (result.success) {
            toast({
              title: 'Payment Successful',
              description: `Your subscription has been upgraded to ${result.tier}.`,
              variant: 'default',
            });
          } else {
            toast({
              title: 'Payment Verification Failed',
              description: result.error || 'There was an issue verifying your payment. Please contact support.',
              variant: 'destructive',
            });
          }
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to verify payment status.',
            variant: 'destructive',
          });
        })
        .finally(() => {
          // Remove URL parameters after processing
          router.replace('/dashboard/billing');
        });
    } else if (status === 'canceled') {
      toast({
        title: 'Checkout Canceled',
        description: 'You have canceled the checkout process.',
        variant: 'default',
      });
    }
  }, [sessionId, status, toast]);

  return null;
}
