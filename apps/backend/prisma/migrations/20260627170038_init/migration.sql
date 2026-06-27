-- AlterTable
ALTER TABLE "AvatarVideo" ADD COLUMN     "VideoUrl" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remixFormId" TEXT;

-- AddForeignKey
ALTER TABLE "AvatarVideo" ADD CONSTRAINT "AvatarVideo_remixFormId_fkey" FOREIGN KEY ("remixFormId") REFERENCES "AvatarVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
