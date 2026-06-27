/*
  Warnings:

  - You are about to drop the column `avatarId` on the `AvatarVideo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvatarVideo" DROP CONSTRAINT "AvatarVideo_avatarId_fkey";

-- AlterTable
ALTER TABLE "AvatarVideo" DROP COLUMN "avatarId";

-- CreateIndex
CREATE INDEX "AvatarVideoReference_avatarId_idx" ON "AvatarVideoReference"("avatarId");

-- CreateIndex
CREATE INDEX "AvatarVideoReference_avatarvideoId_idx" ON "AvatarVideoReference"("avatarvideoId");
