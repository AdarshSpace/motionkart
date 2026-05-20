/*
  Warnings:

  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Float`.
  - You are about to alter the column `provider` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[receipt]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[webhookEventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    ADD COLUMN `event` VARCHAR(191) NULL,
    ADD COLUMN `failureReason` VARCHAR(191) NULL,
    ADD COLUMN `orderId` VARCHAR(191) NOT NULL,
    ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `paymentId` VARCHAR(191) NULL,
    ADD COLUMN `receipt` VARCHAR(191) NULL,
    ADD COLUMN `webhookEventId` VARCHAR(191) NULL,
    MODIFY `amount` FLOAT NOT NULL,
    MODIFY `provider` ENUM('RAZORPAY', 'STRIPE') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `payments_receipt_key` ON `payments`(`receipt`);

-- CreateIndex
CREATE UNIQUE INDEX `payments_orderId_key` ON `payments`(`orderId`);

-- CreateIndex
CREATE UNIQUE INDEX `payments_paymentId_key` ON `payments`(`paymentId`);

-- CreateIndex
CREATE UNIQUE INDEX `payments_webhookEventId_key` ON `payments`(`webhookEventId`);

-- CreateIndex
CREATE INDEX `payments_status_idx` ON `payments`(`status`);
