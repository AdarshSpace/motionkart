-- CreateTable
CREATE TABLE `saved_videos` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `savedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `saved_videos_userId_idx`(`userId`),
    UNIQUE INDEX `saved_videos_userId_videoId_key`(`userId`, `videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `saved_videos` ADD CONSTRAINT `saved_videos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_videos` ADD CONSTRAINT `saved_videos_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `videos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_videos` ADD CONSTRAINT `saved_videos_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
