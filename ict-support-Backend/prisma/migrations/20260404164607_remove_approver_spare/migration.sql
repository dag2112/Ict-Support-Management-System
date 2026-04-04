/*
  Warnings:

  - The values [NEED_SPARE,SPARE_ALLOCATED,PURCHASE_REQUESTED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpareRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ASSIGNED', 'FIXED', 'ESCALATED');
ALTER TABLE "SupportRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "SupportRequest" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
ALTER TABLE "SupportRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('REQUESTER', 'TECHNICIAN', 'MANAGER', 'STOREKEEPER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'REQUESTER';
COMMIT;

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_requestId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "SpareRequest" DROP CONSTRAINT "SpareRequest_requestId_fkey";

-- DropForeignKey
ALTER TABLE "SpareRequest" DROP CONSTRAINT "SpareRequest_requestedById_fkey";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "SpareRequest";

-- DropEnum
DROP TYPE "SpareStatus";
