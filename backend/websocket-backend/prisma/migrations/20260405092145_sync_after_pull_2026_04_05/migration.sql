/*
  Warnings:

  - You are about to drop the column `adhaarNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `contactemail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `relationship` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "adhaarNumber",
DROP COLUMN "age",
DROP COLUMN "contactName",
DROP COLUMN "contactemail",
DROP COLUMN "destination",
DROP COLUMN "nationality",
DROP COLUMN "relationship";
