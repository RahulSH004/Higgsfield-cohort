/*
  Warnings:

  - Added the required column `url` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avatar" ADD COLUMN     "url" TEXT NOT NULL;
