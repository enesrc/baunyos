-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title_tr" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "content_tr" TEXT NOT NULL,
    "content_en" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label_tr" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,
    "href" TEXT,
    "parent_id" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "NavItem_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "NavItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title_tr" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "content_tr" TEXT NOT NULL,
    "content_en" TEXT NOT NULL,
    "published_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
