-- Step 1: Ensure pgcrypto extension is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 1: Update the NULL values in the "id" column
UPDATE "NotificationReceiver"
SET "id" = gen_random_uuid()
WHERE "id" IS NULL;

-- Step 2: Drop the old primary key constraint
ALTER TABLE "NotificationReceiver" 
DROP CONSTRAINT "NotificationReceiver_pkey";

-- Step 3: Set the "id" column as NOT NULL
ALTER TABLE "NotificationReceiver"
ALTER COLUMN "id" SET NOT NULL;

-- Step 4: Add the new primary key constraint on the "id" column
ALTER TABLE "NotificationReceiver"
ADD CONSTRAINT "NotificationReceiver_pkey" PRIMARY KEY ("id");


