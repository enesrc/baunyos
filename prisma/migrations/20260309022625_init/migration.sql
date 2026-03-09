/*
  Warnings:

  - You are about to drop the column `slug` on the `page` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `sitesettings` table. All the data in the column will be lost.
  - You are about to drop the column `logo_text_en` on the `sitesettings` table. All the data in the column will be lost.
  - You are about to drop the column `logo_text_tr` on the `sitesettings` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `sitesettings` table. All the data in the column will be lost.
  - Added the required column `footer_title_en` to the `SiteSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `footer_title_tr` to the `SiteSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Page_slug_key` ON `page`;

-- AlterTable
ALTER TABLE `page` DROP COLUMN `slug`;

-- AlterTable
ALTER TABLE `sitesettings` DROP COLUMN `email`,
    DROP COLUMN `logo_text_en`,
    DROP COLUMN `logo_text_tr`,
    DROP COLUMN `phone`,
    ADD COLUMN `footer_title_en` TEXT NOT NULL,
    ADD COLUMN `footer_title_tr` TEXT NOT NULL,
    ADD COLUMN `header_title_en` VARCHAR(191) NOT NULL DEFAULT 'International Students',
    ADD COLUMN `header_title_tr` VARCHAR(191) NOT NULL DEFAULT 'Uluslararası Öğrenci',
    MODIFY `id` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `title_tr` VARCHAR(191) NOT NULL,
    `title_en` VARCHAR(191) NOT NULL,
    `desc_tr` TEXT NOT NULL,
    `desc_en` TEXT NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address_tr` TEXT NOT NULL,
    `address_en` TEXT NOT NULL,
    `google_maps_url` TEXT NOT NULL,
    `facebook` VARCHAR(191) NOT NULL,
    `instagram` VARCHAR(191) NOT NULL,
    `youtube` VARCHAR(191) NOT NULL,
    `linkedin` VARCHAR(191) NOT NULL,
    `twitter` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
