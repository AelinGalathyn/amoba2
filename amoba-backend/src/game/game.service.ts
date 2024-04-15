import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MoveDto } from "./move.dto";

@Injectable()
export class GameService implements OnModuleInit {
  constructor(private prisma: PrismaService) {
  }

  onModuleInit() {
    setInterval(async () => {
      const games = await this.prisma.game.findMany();
      const currentTime: Date = new Date();
      for (const game of games) {
        let sinceLastMove = (currentTime.getTime() - game.lastActionTimestamp.getTime()) / 1000;
        let sinceLastCheckup = (currentTime.getTime() - game.lastCheckupTime.getTime()) / 1000;
        if (game.won === "false" && sinceLastMove >= 10) {
          await this.prisma.game.update({
            where: { id: game.id },
            data: {
              won: "timeout",
              lastActionTimestamp: new Date()
            }
          });
        }
        else if(sinceLastCheckup >= 10){
          await this.prisma.game.update({
            where: { id: game.id },
            data: {
              won: "timeout",
              lastActionTimestamp: new Date()
            }
          });
        }
      }
    }, 5000);
  }

  async getGameState(sessionId: number) {
    const game = await this.prisma.game.findFirst({
      where: { OR: [{ session1: sessionId }, { session2: sessionId }] }
    });
    this.prisma.game.update({
      where: { id: game.id },
      data: { lastCheckupTime: new Date() }
    });

    if (!game) {
      throw new NotFoundException("Game not found");
    }

    let board: any[][];

    board = JSON.parse(game.state);

    const playerRole = game.session1 === sessionId ? "player1" : "player2";

    const empty = board.flat().filter(x => x === ".").length;
    const movecounter = 8 * 8 - empty;

    const currentTime = new Date();
    const remainingTime = (currentTime.getTime() - game.lastActionTimestamp.getTime()) / 1000;
    if (game.won !== "true" && remainingTime >= 10) {
      await this.prisma.game.update({
        where: { id: game.id },
        data: { won: "timeout" }
      });
    }

    const win: string = game.won;

    return {
      win,
      playerRole,
      remainingTime: 10 - Math.round(remainingTime),
      gameState: board,
      isActive: movecounter % 2 === 0 ? playerRole === "player1" : playerRole === "player2"
    };
  }

  async play(sessionId: number, move: MoveDto) {
    const game = await this.prisma.game.findFirst({
      where: { OR: [{ session1: sessionId }, { session2: sessionId }] }
    });
    if (!game) {
      throw new NotFoundException("Game not found");
    }

    const playerSymbol = game.session1 === sessionId ? "X" : "O";
    let board = JSON.parse(game.state);

    if (board[move.x][move.y] !== ".") {
      throw new Error("Cell is already occupied");
    }

    board[move.x][move.y] = playerSymbol;

    const win = this.checkWin(board, move.x, move.y, playerSymbol);

    if (win) {
      await this.prisma.game.update({
        where: { id: game.id },
        data: { won: "true", lastActionTimestamp: new Date(), state: JSON.stringify(board), lastCheckupTime: new Date() }
      });
    } else {
      await this.prisma.game.update({
        where: { id: game.id },
        data: { state: JSON.stringify(board), lastActionTimestamp: new Date(), lastCheckupTime: new Date() }
      });
    }

    return { board, win };
  }

  checkWin(board: any[][], x: number, y: number, symbol: string) {
    const rowWin = board[x].filter(cell => cell === symbol).length === 5;
    const colWin = board.filter(row => row[y] === symbol).length === 5;
    const diagWin = this.checkDiagWin(board, x, y, symbol);

    return rowWin || colWin || diagWin;
  }

  private checkDiagWin(board: any[][], x: number, y: number, symbol: string) {
    let count = 1;

    for (let i = 1; i < 5; i++) {  //start-move
      if (x - i < 0 || y - i < 0 || board[x - i][y - i] !== symbol) break;
      count++;
    }
    for (let i = 1; i < 5; i++) {  //move-end
      if (x + i >= 8 || y + i >= 8 || board[x + i][y + i] !== symbol) break;
      count++;
    }
    if (count >= 5) return true;

    count = 1;

    for (let i = 1; i < 5; i++) {  //top-right-move
      if (x - i < 0 || y + i >= 8 || board[x - i][y + i] !== symbol) break;
      count++;
    }
    for (let i = 1; i < 5; i++) {
      if (x + i >= 8 || y - i < 0 || board[x + i][y - i] !== symbol) break;
      count++;
    }
    return count >= 5;
  }
}
