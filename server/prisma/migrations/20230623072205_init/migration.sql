/*
  Warnings:

  - Added the required column `contactOwnerId` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contact" DROP CONSTRAINT "contact_userId_fkey";

-- DropIndex
DROP INDEX "contact_userId_key";

-- AlterTable
ALTER TABLE "contact" ADD COLUMN     "contactOwnerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_contactOwnerId_fkey" FOREIGN KEY ("contactOwnerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
