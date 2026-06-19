-- CreateEnum
CREATE TYPE "AvatarImageType" AS ENUM ('USER', 'MODEL');

-- CreateEnum
CREATE TYPE "AvatarVideoStatus" AS ENUM ('PENDING', 'SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwaord" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarImage" (
    "id" TEXT NOT NULL,
    "avatarid" TEXT NOT NULL,
    "type" "AvatarImageType" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "AvatarImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarVideo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "startFrame" TEXT,
    "endFrame" TEXT,
    "width" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "status" "AvatarVideoStatus" NOT NULL,

    CONSTRAINT "AvatarVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarVideoRefrence" (
    "id" TEXT NOT NULL,
    "avatarvideoId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,

    CONSTRAINT "AvatarVideoRefrence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarImage" ADD CONSTRAINT "AvatarImage_avatarid_fkey" FOREIGN KEY ("avatarid") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarVideo" ADD CONSTRAINT "AvatarVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarVideoRefrence" ADD CONSTRAINT "AvatarVideoRefrence_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarVideoRefrence" ADD CONSTRAINT "AvatarVideoRefrence_avatarvideoId_fkey" FOREIGN KEY ("avatarvideoId") REFERENCES "AvatarVideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
