/*
  Warnings:

  - Added the required column `category` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courses` ADD COLUMN `category` TEXT NOT NULL,
    ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `lessons` INTEGER NULL,
    ADD COLUMN `rating` FLOAT NULL,
    ADD COLUMN `students` INTEGER NULL;
