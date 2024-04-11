-- CreateTable
CREATE TABLE "LobbyEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session1" TEXT NOT NULL,
    "session2" TEXT,
    "lastActionTimestamp" DATETIME,
    "state" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LobbyEntry_sessionId_key" ON "LobbyEntry"("sessionId");
