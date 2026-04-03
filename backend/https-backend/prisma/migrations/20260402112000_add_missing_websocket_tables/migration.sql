DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LocationSource') THEN
    CREATE TYPE "LocationSource" AS ENUM ('GPS', 'NETWORK');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ItineraryStatus') THEN
    CREATE TYPE "ItineraryStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "LocationLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "accuracy" DOUBLE PRECISION,
  "speed" DOUBLE PRECISION,
  "heading" DOUBLE PRECISION,
  "riskScore" INTEGER NOT NULL,
  "source" "LocationSource" NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LocationLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "EmergencyContact" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "relation" TEXT NOT NULL,
  CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Itinerary" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "startLocation" TEXT NOT NULL,
  "endLocation" TEXT NOT NULL,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "ItineraryStatus" NOT NULL,
  "checklist" JSONB,
  CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LocationLog_userId_idx" ON "LocationLog"("userId");
CREATE INDEX IF NOT EXISTS "EmergencyContact_userId_idx" ON "EmergencyContact"("userId");
CREATE INDEX IF NOT EXISTS "Itinerary_userId_idx" ON "Itinerary"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'LocationLog_userId_fkey'
  ) THEN
    ALTER TABLE "LocationLog"
      ADD CONSTRAINT "LocationLog_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'EmergencyContact_userId_fkey'
  ) THEN
    ALTER TABLE "EmergencyContact"
      ADD CONSTRAINT "EmergencyContact_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Itinerary_userId_fkey'
  ) THEN
    ALTER TABLE "Itinerary"
      ADD CONSTRAINT "Itinerary_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
