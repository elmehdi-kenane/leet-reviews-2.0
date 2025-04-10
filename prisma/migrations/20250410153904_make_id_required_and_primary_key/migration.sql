/*
  Warnings:

  - The primary key for the `NotificationReceiver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `id` on table `NotificationReceiver` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NotificationReceiver" DROP CONSTRAINT "NotificationReceiver_pkey",
ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "NotificationReceiver_pkey" PRIMARY KEY ("id");
