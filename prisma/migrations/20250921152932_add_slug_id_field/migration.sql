/*
  Warnings:

  - Added the required column `slugId` to the `log_entries` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_log_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slugId" TEXT NOT NULL,
    "fats" REAL NOT NULL,
    "sugars" REAL NOT NULL,
    "carbohydrates" REAL NOT NULL,
    "proteins" REAL NOT NULL,
    "calories" REAL NOT NULL,
    "notes" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "log_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_log_entries" ("calories", "carbohydrates", "fats", "id", "notes", "proteins", "slug", "slugId", "sugars", "timestamp", "userId") SELECT "calories", "carbohydrates", "fats", "id", "notes", "proteins", "slug", "slug" || "-" || "id", "sugars", "timestamp", "userId" FROM "log_entries";
DROP TABLE "log_entries";
ALTER TABLE "new_log_entries" RENAME TO "log_entries";
CREATE UNIQUE INDEX "log_entries_slugId_key" ON "log_entries"("slugId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
