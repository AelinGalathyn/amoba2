-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session1" TEXT NOT NULL,
    "session2" TEXT,
    "lastActionTimestamp" DATETIME,
    "state" TEXT NOT NULL,
    "won" TEXT NOT NULL DEFAULT 'false'
);
INSERT INTO "new_Game" ("id", "lastActionTimestamp", "session1", "session2", "state", "won") SELECT "id", "lastActionTimestamp", "session1", "session2", "state", "won" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
