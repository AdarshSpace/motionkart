-- AlterTable
ALTER TABLE `courses` MODIFY `isPublished` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `purchases` ADD COLUMN `paid` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `course_progress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `completedVideos` INTEGER NOT NULL DEFAULT 0,
    `totalVideos` INTEGER NOT NULL,
    `progressPercent` DOUBLE NOT NULL DEFAULT 0,
    `lastVideoId` VARCHAR(191) NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `completedAt` DATETIME(3) NULL,

    INDEX `course_progress_userId_idx`(`userId`),
    INDEX `course_progress_courseId_idx`(`courseId`),
    UNIQUE INDEX `course_progress_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video_progress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `watchedSeconds` INTEGER NOT NULL DEFAULT 0,
    `lastPosition` INTEGER NOT NULL DEFAULT 0,
    `completedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `video_progress_userId_idx`(`userId`),
    INDEX `video_progress_courseId_idx`(`courseId`),
    INDEX `video_progress_videoId_idx`(`videoId`),
    UNIQUE INDEX `video_progress_userId_videoId_key`(`userId`, `videoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course_progress` ADD CONSTRAINT `course_progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_progress` ADD CONSTRAINT `course_progress_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video_progress` ADD CONSTRAINT `video_progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video_progress` ADD CONSTRAINT `video_progress_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video_progress` ADD CONSTRAINT `video_progress_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `videos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
