# System Patterns

## Database Operations Analysis

### Current Implementation Analysis

#### Credit Management System
- `getUserCredits`: The nested includes and field selections match UI requirements
  - Credit information needed for progress bar
  - Subscription data needed for renewal display
  - Field selection is already optimized
- `deductCredits`: Two separate database calls serve different purposes
  - First call validates credit availability
  - Second call updates the count atomically

#### Billing System
- `manageSubscription`: Handles subscription lifecycle
  - Creates/updates Stripe customer
  - Manages subscription status
  - Updates credit allocation
- `verifyPayment`: Payment verification flow
  - Validates Stripe sessions
  - Updates subscription status
  - Tracks session usage
  - Triggers credit updates
  - Prevents session reuse

#### Webhook System
- `handleStripeWebhook`: Event-driven updates
  - Signature verification
  - Event type routing
  - Atomic database updates
  - Error recovery patterns

#### Image Generation System
- `getUserImages`: Data fetching matches dashboard grid requirements
  - All sessions needed for grid display
  - Complete session data needed for UI elements
  - Image data required for download functionality
  - Current field selection is appropriate

### Optimization Recommendations

1. Add Database Indices:
```prisma
// Add to schema.prisma
model GenerationSession {
  // ... existing fields

  @@index([userId, createdAt]) // Optimize frequent timestamp-based queries
}

model Credit {
  // ... existing fields

  @@index([userId, resetDate]) // Optimize credit reset queries
}

model Subscription {
  // ... existing fields

  @@index([userId, status]) // Optimize subscription lookups
  @@index([stripeSubscriptionId]) // Optimize webhook queries
}
```

2. Session Tracking Pattern:
```typescript
// Subscription model handles session tracking
async function verifySession(
  sessionId: string,
  userId: string,
  transaction: PrismaTransaction
) {
  const subscription = await transaction.subscription.findFirst({
    where: {
      OR: [
        { stripeSubscriptionId: sessionId },
        { stripeSessionId: sessionId }
      ],
      userId
    }
  });

  if (subscription) {
    throw new Error('Session already processed');
  }
}
```

3. Implement Query Monitoring:
```typescript
// Add to lib/prisma.ts
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
  })
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
  
  prisma.$on('query', (e) => {
    console.log(`Query took ${e.duration}ms: ${e.query}`)
  })
}
```

### Current Recommendations

1. Credit Management
   - Maintain atomic credit operations
   - Use database transactions for subscription changes
   - Implement proper error recovery
   - Add credit history tracking
   - Validate credit updates

2. Subscription Handling
   - Verify webhook signatures
   - Use idempotency keys
   - Implement retry logic
   - Maintain audit logs
   - Track session usage
   - Prevent duplicate processing

3. Database Operations
   - Use transactions for related updates
   - Optimize query patterns
   - Monitor query performance
   - Implement proper indices
   - Maintain data consistency

4. Error Recovery
   - Implement webhook retry queue
   - Add failure logging
   - Create recovery procedures
   - Monitor system health
   - Track error patterns
   - Implement proper rollbacks

The current implementation effectively handles billing and subscription management. Recent improvements in session tracking and subscription model consolidation have enhanced system reliability. Future optimizations should focus on scaling patterns and monitoring systems rather than premature optimization.