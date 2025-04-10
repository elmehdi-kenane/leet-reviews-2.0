-- DropForeignKey
ALTER TABLE "NotificationReceiver" DROP CONSTRAINT "NotificationReceiver_userId_fkey";

-- AddForeignKey
ALTER TABLE "NotificationReceiver" ADD CONSTRAINT "NotificationReceiver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
