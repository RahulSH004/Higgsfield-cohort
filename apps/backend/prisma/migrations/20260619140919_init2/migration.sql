/*
  Warnings:

  - You are about to drop the column `passwaord` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwaord",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AvatarVideo" ADD CONSTRAINT "AvatarVideo_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
