-- CreateTable
CREATE TABLE "log_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fats" REAL NOT NULL,
    "sugars" REAL NOT NULL,
    "carbohydrates" REAL NOT NULL,
    "proteins" REAL NOT NULL,
    "calories" REAL NOT NULL,
    "notes" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
