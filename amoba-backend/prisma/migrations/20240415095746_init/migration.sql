-- CreateTable
CREATE TABLE "LobbyEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session1" INTEGER NOT NULL,
    "session2" INTEGER,
    "lastActionTimestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL,
    "won" TEXT NOT NULL DEFAULT 'false',
    "lastCheckupTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "LobbyEntry_sessionId_key" ON "LobbyEntry"("sessionId");
