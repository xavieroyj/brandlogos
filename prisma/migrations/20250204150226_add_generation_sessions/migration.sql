/*
  Warnings:

  - You are about to drop the column `brandName` on the `GeneratedImage` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `GeneratedImage` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `GeneratedImage` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `GeneratedImage` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `GeneratedImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneratedImage" DROP COLUMN "brandName",
DROP COLUMN "prompt",
DROP COLUMN "style",
DROP COLUMN "tags",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GenerationSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenerationSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GenerationSession_userId_idx" ON "GenerationSession"("userId");

-- CreateIndex
CREATE INDEX "GeneratedImage_sessionId_idx" ON "GeneratedImage"("sessionId");

-- AddForeignKey
ALTER TABLE "GenerationSession" ADD CONSTRAINT "GenerationSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedImage" ADD CONSTRAINT "GeneratedImage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "GenerationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
