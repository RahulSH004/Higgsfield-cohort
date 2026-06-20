/*
  Warnings:

  - You are about to drop the `AvatarVideoRefrence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvatarVideoRefrence" DROP CONSTRAINT "AvatarVideoRefrence_avatarId_fkey";

-- DropForeignKey
ALTER TABLE "AvatarVideoRefrence" DROP CONSTRAINT "AvatarVideoRefrence_avatarvideoId_fkey";

-- DropTable
DROP TABLE "AvatarVideoRefrence";

-- CreateTable
CREATE TABLE "AvatarVideoReference" (
    "id" TEXT NOT NULL,
    "avatarvideoId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,

    CONSTRAINT "AvatarVideoReference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AvatarVideoReference" ADD CONSTRAINT "AvatarVideoReference_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarVideoReference" ADD CONSTRAINT "AvatarVideoReference_avatarvideoId_fkey" FOREIGN KEY ("avatarvideoId") REFERENCES "AvatarVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
