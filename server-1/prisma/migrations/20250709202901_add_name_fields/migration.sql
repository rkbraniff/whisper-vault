/*
  Warnings:

  - You are about to drop the column `pubKey` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_pubKey_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pubKey",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "publicKey" TEXT;
