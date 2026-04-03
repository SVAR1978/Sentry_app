-- Rename legacy user columns to match the current Prisma schema.
ALTER TABLE "User" RENAME COLUMN "emailAddress" TO "email";
ALTER TABLE "User" RENAME COLUMN "phoneNumber" TO "phone";

-- Normalize rows that may have been left nullable by the previous migration.
UPDATE "User"
SET "name" = COALESCE("name", ''),
    "phone" = COALESCE("phone", ''),
    "role" = CASE
      WHEN "role" IS NULL THEN 'USER'
      WHEN UPPER("role") = 'ADMIN' THEN 'ADMIN'
      ELSE 'USER'
    END;

-- Convert role to the enum used by the Prisma schema.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
  END IF;
END $$;

ALTER TABLE "User"
  ALTER COLUMN "name" SET NOT NULL,
  ALTER COLUMN "phone" SET NOT NULL,
  ALTER COLUMN "role" DROP DEFAULT,
  ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";

ALTER TABLE "User"
  ALTER COLUMN "role" SET DEFAULT 'USER';

-- Keep the unique index aligned with the renamed email column.
DROP INDEX IF EXISTS "User_emailAddress_key";
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
