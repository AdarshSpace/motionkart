/*
  Warnings:

  - A unique constraint covering the columns `[muxAssetId]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `videos` ADD COLUMN `muxAssetId` VARCHAR(191) NULL,
    ADD COLUMN `muxPlaybackId` VARCHAR(191) NULL,
    ADD COLUMN `muxUploadId` VARCHAR(191) NULL,
    MODIFY `videoUrl` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `videos_muxAssetId_key` ON `videos`(`muxAssetId`);
