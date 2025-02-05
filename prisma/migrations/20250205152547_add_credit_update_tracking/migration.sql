-- AlterTable
ALTER TABLE "Credit" ADD COLUMN     "updateStatus" TEXT NOT NULL DEFAULT 'COMPLETED';

-- CreateTable
CREATE TABLE "CreditUpdateLog" (
    "id" TEXT NOT NULL,
    "creditId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditUpdateLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditUpdateLog_creditId_idx" ON "CreditUpdateLog"("creditId");

-- AddForeignKey
ALTER TABLE "CreditUpdateLog" ADD CONSTRAINT "CreditUpdateLog_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "Credit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
