/*
  Warnings:

  - You are about to drop the column `lessonId` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[moduleId,position]` on the table `videos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `moduleId` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `lessons` DROP FOREIGN KEY `lessons_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `videos` DROP FOREIGN KEY `videos_lessonId_fkey`;

-- DropIndex
DROP INDEX `videos_lessonId_idx` ON `videos`;

-- DropIndex
DROP INDEX `videos_lessonId_position_key` ON `videos`;

-- AlterTable
ALTER TABLE `videos` DROP COLUMN `lessonId`,
    ADD COLUMN `moduleId` VARCHAR(191) NOT NULL,
    ADD COLUMN `notesUrl` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `lessons`;

-- CreateIndex
CREATE INDEX `videos_moduleId_idx` ON `videos`(`moduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `videos_moduleId_position_key` ON `videos`(`moduleId`, `position`);

-- AddForeignKey
ALTER TABLE `videos` ADD CONSTRAINT `videos_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
