/*
  Warnings:

  - You are about to drop the column `type` on the `Avatar` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Avatar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "type",
DROP COLUMN "url";
