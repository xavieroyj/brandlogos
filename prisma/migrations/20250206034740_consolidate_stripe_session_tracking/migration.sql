/*
  Warnings:

  - You are about to drop the `ProcessedStripeSession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "stripeSessionId" TEXT;

-- DropTable
DROP TABLE "ProcessedStripeSession";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSessionId_key" ON "Subscription"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Subscription_stripeSessionId_idx" ON "Subscription"("stripeSessionId");
