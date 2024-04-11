/*
  Warnings:

  - You are about to alter the column `lastActionTimestamp` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.
  - Made the column `lastActionTimestamp` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session1" TEXT NOT NULL,
    "session2" TEXT,
    "lastActionTimestamp" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "won" TEXT NOT NULL DEFAULT 'false'
);
INSERT INTO "new_Game" ("id", "lastActionTimestamp", "session1", "session2", "state", "won") SELECT "id", "lastActionTimestamp", "session1", "session2", "state", "won" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
