/*
  Warnings:

  - Added the required column `userId` to the `goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `log_entries` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_goals" ("createdAt", "id", "type", "updatedAt", "value") SELECT "createdAt", "id", "type", "updatedAt", "value" FROM "goals";
DROP TABLE "goals";
ALTER TABLE "new_goals" RENAME TO "goals";
CREATE UNIQUE INDEX "goals_userId_type_key" ON "goals"("userId", "type");
CREATE TABLE "new_log_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_log_entries" ("calories", "carbohydrates", "fats", "id", "notes", "proteins", "slug", "sugars", "timestamp") SELECT "calories", "carbohydrates", "fats", "id", "notes", "proteins", "slug", "sugars", "timestamp" FROM "log_entries";
DROP TABLE "log_entries";
ALTER TABLE "new_log_entries" RENAME TO "log_entries";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
