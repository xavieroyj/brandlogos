# Stripe Integration Plan

## 1. Schema Updates
```prisma
model Subscription {
  id                  String   @id @default(cuid())
  stripeSubscriptionId String  @unique  // Add this field
  userId              String
  user                User     @relation(fields: [userId], references: [id])
  status              String
  priceId             String
  currentPeriodEnd    DateTime
  billingCycle        String
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@unique([id, priceId])
  @@index([userId])
  @@index([stripeSubscriptionId])  // Add this index
}
```

## 2. Credit Allocation by Tier
- FREE: 5 daily credits
- PRO: 20 daily credits
- ENTERPRISE: 50 daily credits

## 3. Webhook Implementation
Create new endpoint: `/api/webhooks/stripe/route.ts`

### Handle Events:
1. `customer.subscription.created`:
   - Update user's subscription record
   - Set appropriate tier
   - Adjust credit allocation

2. `customer.subscription.updated`:
   - Update subscription status
   - Handle plan changes
   - Adjust credits based on new tier

3. `customer.subscription.deleted`:
   - Mark subscription inactive
   - Revert to FREE tier
   - Reset credit allocation

## 4. Credit Reset CRON Updates
Modify `/api/cron/reset-credits/route.ts` to:
- Check user's current subscription tier
- Apply appropriate daily credit limit
- Handle subscription status
- Maintain proper reset timing

## 5. Implementation Steps
1. Create new Prisma migration for schema changes
2. Implement Stripe webhook handler
3. Update credit management system
4. Modify CRON job logic
5. Add proper error handling and logging
6. Implement rollback mechanisms

## 6. Security Considerations
- Verify Stripe webhook signatures
- Use environment variables for secrets
- Implement proper error handling
- Add request rate limiting
- Log all subscription changes

## 7. Testing Plan
1. Test subscription creation flow
2. Verify credit allocation by tier
3. Test tier changes and credit updates
4. Verify cancellation handling
5. Test CRON job with different tiers
6. Verify webhook signature validation

## 8. Rollout Strategy
1. Run migration in development
2. Test all scenarios locally
3. Deploy to staging
4. Verify webhook handling
5. Monitor credit allocations
6. Deploy to production

## 9. Monitoring
- Log all webhook events
- Track credit reset operations
- Monitor subscription changes
- Alert on webhook failures
- Track credit usage patterns