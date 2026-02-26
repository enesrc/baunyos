-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title_tr" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "content_tr" TEXT NOT NULL,
    "content_en" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Page" ("content_en", "content_tr", "id", "slug", "title_en", "title_tr") SELECT "content_en", "content_tr", "id", "slug", "title_en", "title_tr" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
