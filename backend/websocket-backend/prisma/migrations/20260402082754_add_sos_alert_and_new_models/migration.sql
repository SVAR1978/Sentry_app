DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SOSStatus') THEN
        CREATE TYPE "SOSStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'CANCELLED', 'ESCALATED');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "SOSAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SOSStatus" NOT NULL DEFAULT 'ACTIVE',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "emergencyContacts" JSONB,
    "resolvedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SOSAlert_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SOSAlert_userId_idx" ON "SOSAlert"("userId");
CREATE INDEX IF NOT EXISTS "SOSAlert_status_idx" ON "SOSAlert"("status");
CREATE INDEX IF NOT EXISTS "SOSAlert_createdAt_idx" ON "SOSAlert"("createdAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'SOSAlert_userId_fkey'
    ) THEN
        ALTER TABLE "SOSAlert"
            ADD CONSTRAINT "SOSAlert_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
