/*
  Warnings:

  - You are about to drop the column `logo_text` on the `SiteSettings` table. All the data in the column will be lost.
  - Added the required column `logo_text_en` to the `SiteSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_text_tr` to the `SiteSettings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logo_text_tr" TEXT NOT NULL,
    "logo_text_en" TEXT NOT NULL
);
INSERT INTO "new_SiteSettings" ("email", "id", "phone") SELECT "email", "id", "phone" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
