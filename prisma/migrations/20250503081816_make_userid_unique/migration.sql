/*
  Warnings:

  - You are about to drop the column `createdAt` on the `PlaidItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `PlaidItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PlaidItem" DROP COLUMN "createdAt";

-- CreateIndex
CREATE UNIQUE INDEX "PlaidItem_userId_key" ON "PlaidItem"("userId");
