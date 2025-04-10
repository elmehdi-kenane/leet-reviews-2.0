-- DropForeignKey
ALTER TABLE "NotificationReceiver" DROP CONSTRAINT "NotificationReceiver_notificationId_fkey";

-- AddForeignKey
ALTER TABLE "NotificationReceiver" ADD CONSTRAINT "NotificationReceiver_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
