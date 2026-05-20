-- AlterTable
ALTER TABLE `videos` ADD COLUMN `aiProcessingStatus` ENUM('pending', 'ready', 'failed') NOT NULL DEFAULT 'pending',
    ADD COLUMN `videoPath` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ChatMessage` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ChatMessage_userId_idx`(`userId`),
    INDEX `ChatMessage_videoId_idx`(`videoId`),
    UNIQUE INDEX `ChatMessage_userId_videoId_key`(`userId`, `videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatMessage` ADD CONSTRAINT `ChatMessage_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `videos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
