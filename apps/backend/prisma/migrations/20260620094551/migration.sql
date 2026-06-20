/*
  Warnings:

  - You are about to drop the column `height` on the `AvatarVideo` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `AvatarVideo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aspect_ratio` to the `AvatarImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AvatarImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aspect_ratio` to the `AvatarVideo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AvatarVideo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Aspectratio" AS ENUM ('SQUARE', 'PORTRAIT', 'LANDSCAPE', 'WIDE');

-- AlterTable
ALTER TABLE "Avatar" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AvatarImage" ADD COLUMN     "aspect_ratio" "Aspectratio" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AvatarVideo" DROP COLUMN "height",
DROP COLUMN "width",
ADD COLUMN     "aspect_ratio" "Aspectratio" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
