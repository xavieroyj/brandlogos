-- CreateTable
CREATE TABLE "ProcessedStripeSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedStripeSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedStripeSession_sessionId_key" ON "ProcessedStripeSession"("sessionId");

-- CreateIndex
CREATE INDEX "ProcessedStripeSession_userId_idx" ON "ProcessedStripeSession"("userId");

-- CreateIndex
CREATE INDEX "ProcessedStripeSession_sessionId_idx" ON "ProcessedStripeSession"("sessionId");
