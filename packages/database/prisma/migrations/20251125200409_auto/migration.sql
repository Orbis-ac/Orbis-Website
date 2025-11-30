/*
  Warnings:

  - You are about to drop the column `avatar` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "session_token_idx";

-- DropIndex
DROP INDEX "user_createdAt_idx";

-- DropIndex
DROP INDEX "user_role_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "avatar",
DROP COLUMN "isBanned";
