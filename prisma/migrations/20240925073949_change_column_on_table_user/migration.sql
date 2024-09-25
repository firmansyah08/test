/*
  Warnings:

  - You are about to drop the column `isPenalized` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPenalized",
ADD COLUMN     "datePenalized" TIMESTAMP(3);
