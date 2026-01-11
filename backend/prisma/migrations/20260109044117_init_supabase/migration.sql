/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `fromCountry` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `toCountry` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `fromCountryCode` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toCountryCode` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Country" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "category",
DROP COLUMN "fromCountry",
DROP COLUMN "toCountry",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "fromCountryCode" TEXT NOT NULL,
ADD COLUMN     "toCountryCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "surname" SET DEFAULT '';

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_code_key" ON "Category"("code");

-- CreateIndex
CREATE INDEX "Plan_userId_idx" ON "Plan"("userId");

-- CreateIndex
CREATE INDEX "Plan_fromCountryCode_idx" ON "Plan"("fromCountryCode");

-- CreateIndex
CREATE INDEX "Plan_toCountryCode_idx" ON "Plan"("toCountryCode");

-- CreateIndex
CREATE INDEX "Plan_categoryId_idx" ON "Plan"("categoryId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_fromCountryCode_fkey" FOREIGN KEY ("fromCountryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_toCountryCode_fkey" FOREIGN KEY ("toCountryCode") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
