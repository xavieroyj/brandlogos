import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getUserCredits } from '@/app/actions/manage-credits';
import { CREDIT_LIMITS } from '@/lib/stripe';
import { formatDate } from '@/lib/utils';
import { SubscriptionButton } from '@/components/dashboard/SubscriptionButton';
import { BillingStatus } from './BillingStatus';


export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: headers()
  });

  if (!session?.user) {
    redirect('/auth');
  }

  // Get user's current credit and subscription info
  const credits = await getUserCredits(session.user.id);

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <BillingStatus />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and credit usage
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-lg border p-6 bg-card">
          <h3 className="font-semibold mb-2">Current Plan</h3>
          <p className="text-2xl font-bold mb-2">{credits.tier}</p>
          <p className="text-sm text-muted-foreground">
            {CREDIT_LIMITS[credits.tier]} credits per day
          </p>
        </div>

        <div className="rounded-lg border p-6 bg-card">
          <h3 className="font-semibold mb-2">Credit Usage</h3>
          <p className="text-2xl font-bold mb-2">
            {credits.used} / {credits.total}
          </p>
          <p className="text-sm text-muted-foreground">
            Resets at midnight
          </p>
        </div>

        {credits.subscription && (
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="font-semibold mb-2">Next Payment</h3>
            <p className="text-2xl font-bold mb-2">
              {credits.tier === 'PRO' ? '$10.00' : '$50.00'}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(credits.subscription.currentPeriodEnd)}
            </p>
          </div>
        )}
      </div>

      {/* Subscription Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0<span className="text-base font-normal">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li>• 5 daily credits</li>
              <li>• Basic customization</li>
              <li>• PNG downloads</li>
            </ul>
            <SubscriptionButton
              currentTier={credits.tier}
              targetTier="FREE"
            />
          </div>

          {/* Pro Plan */}
          <div className="rounded-lg border p-6 bg-card relative">
            {credits.tier === 'PRO' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                Current
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">$10<span className="text-base font-normal">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li>• 20 daily credits</li>
              <li>• Advanced customization</li>
              <li>• PNG & SVG downloads</li>
              <li>• Priority support</li>
            </ul>
            <SubscriptionButton
              currentTier={credits.tier}
              targetTier="PRO"
            />
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-3xl font-bold mb-4">$50<span className="text-base font-normal">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li>• 50 daily credits</li>
              <li>• All Pro features</li>
              <li>• Custom AI training</li>
              <li>• Dedicated support</li>
              <li>• SLA guarantee</li>
            </ul>
            <SubscriptionButton
              currentTier={credits.tier}
              targetTier="ENTERPRISE"
            />
          </div>
        </div>
      </div>
    </div>
  );
}