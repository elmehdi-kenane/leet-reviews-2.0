ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- Rename the column
ALTER TABLE "Notification" RENAME COLUMN "userId" TO "authorId";

-- Add the new foreign key constraint with the updated column name
ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;