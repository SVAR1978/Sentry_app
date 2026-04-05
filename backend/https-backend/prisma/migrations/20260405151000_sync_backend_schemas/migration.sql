-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('CRITICAL', 'CAUTION', 'INFO');

-- CreateEnum
CREATE TYPE "ZoneLevel" AS ENUM ('SAFE', 'MODERATE', 'AVOID');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "BookingPartner" (
	"id" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"url" TEXT NOT NULL,
	"logoUrl" TEXT,
	"category" TEXT NOT NULL,
	"isVerified" BOOLEAN NOT NULL DEFAULT true,
	"isActive" BOOLEAN NOT NULL DEFAULT true,
	"priority" INTEGER NOT NULL DEFAULT 0,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,

	CONSTRAINT "BookingPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingVisit" (
	"id" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"partnerId" TEXT NOT NULL,
	"durationMs" INTEGER NOT NULL,
	"visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "BookingVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
	"id" TEXT NOT NULL,
	"ticketNumber" SERIAL NOT NULL,
	"userId" TEXT,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"subject" TEXT NOT NULL,
	"message" TEXT NOT NULL,
	"status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL,

	CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyAlert" (
	"id" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"severity" "AlertSeverity" NOT NULL,
	"affectedAreas" TEXT[],
	"issuedBy" TEXT,
	"isActive" BOOLEAN NOT NULL DEFAULT true,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"expiresAt" TIMESTAMP(3),

	CONSTRAINT "SafetyAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyZone" (
	"id" TEXT NOT NULL,
	"areaName" TEXT NOT NULL,
	"safetyScore" DOUBLE PRECISION NOT NULL,
	"zoneLevel" "ZoneLevel" NOT NULL,
	"polygon" JSONB,
	"notes" TEXT,
	"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "SafetyZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingVisit_userId_idx" ON "BookingVisit"("userId");

-- CreateIndex
CREATE INDEX "BookingVisit_partnerId_idx" ON "BookingVisit"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- AddForeignKey
ALTER TABLE "BookingVisit" ADD CONSTRAINT "BookingVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingVisit" ADD CONSTRAINT "BookingVisit_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "BookingPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;