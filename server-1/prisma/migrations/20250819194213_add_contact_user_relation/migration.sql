-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Contact_userId_idx" ON "Contact"("userId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
