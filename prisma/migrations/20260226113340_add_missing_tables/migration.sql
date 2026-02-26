-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logo_text" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Slider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image_url" TEXT NOT NULL,
    "title_tr" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "QuickAccess" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "icon" TEXT NOT NULL,
    "title_tr" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "desc_tr" TEXT NOT NULL,
    "desc_en" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NavItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label_tr" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,
    "href" TEXT,
    "parent_id" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "NavItem_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "NavItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NavItem" ("href", "id", "label_en", "label_tr", "order", "parent_id") SELECT "href", "id", "label_en", "label_tr", "order", "parent_id" FROM "NavItem";
DROP TABLE "NavItem";
ALTER TABLE "new_NavItem" RENAME TO "NavItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
