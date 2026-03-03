-- AlterTable
ALTER TABLE `announcement` MODIFY `content_tr` TEXT NOT NULL,
    MODIFY `content_en` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `page` MODIFY `content_tr` TEXT NOT NULL,
    MODIFY `content_en` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `quickaccess` MODIFY `desc_tr` TEXT NOT NULL,
    MODIFY `desc_en` TEXT NOT NULL;
