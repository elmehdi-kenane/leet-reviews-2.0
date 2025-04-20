-- Check if enum "notificationType" exists, create if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notificationtype') THEN
        CREATE TYPE "notificationType" AS ENUM ('vote', 'comment', 'save');
    END IF;
END $$;

-- Check if table "Notification" exists, create if it doesn't
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL,
    "type" "notificationType" NOT NULL,
    "voteIsUp" BOOLEAN,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Check if table "NotificationReceiver" exists, create if it doesn't
CREATE TABLE IF NOT EXISTS "NotificationReceiver" (
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotificationReceiver_pkey" PRIMARY KEY ("userId","notificationId")
);

-- Add foreign key constraints only if they do not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Notification_authorId_fkey') THEN
        ALTER TABLE "Notification" ADD CONSTRAINT "Notification_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Notification_feedbackId_fkey') THEN
        ALTER TABLE "Notification" ADD CONSTRAINT "Notification_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'NotificationReceiver_notificationId_fkey') THEN
        ALTER TABLE "NotificationReceiver" ADD CONSTRAINT "NotificationReceiver_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'NotificationReceiver_userId_fkey') THEN
        ALTER TABLE "NotificationReceiver" ADD CONSTRAINT "NotificationReceiver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
