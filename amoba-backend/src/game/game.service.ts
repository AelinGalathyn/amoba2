import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MoveDto } from "./move.dto";

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {
  }
  async getGameState(sessionId: string) {
    const game = await this.prisma.game.findFirst({
      where: {OR: [{ session1: sessionId }, { session2: sessionId }]}
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    let board: any[][];

    if (game.state === "") {
      board = this.initializeGameBoard();
      await this.prisma.game.update({
        where: { id: game.id },
        data: { state: JSON.stringify(board) }
      });
    } else {
      board = JSON.parse(game.state);
    }
    const playerRole = game.session1 === sessionId ? 'player1' : 'player2';

    // Correctly calculate empty squares if necessary.
    const empty = board.flat().filter(x => x === ".").length;
    const movecounter = 8 * 8 - empty;

    const win: boolean = game.won;


    return {
      win,
      symbol: (playerRole === 'player1' ? 'X' : 'O'),
      gameState: board, // Return the potentially updated board as a JSON string
      isActive: movecounter % 2 === 0 ? playerRole === "player1" : playerRole === "player2",
    };
  }

  async play(sessionId: string, move: MoveDto){
    const game = await this.prisma.game.findFirst({
      where: { OR: [{session1: sessionId}, {session2: sessionId}]}
    });
    if (!game){
      throw new NotFoundException('Game not found');
    }

    const playerSymbol = game.session1 === sessionId ? 'X' : 'O';
    let board = JSON.parse(game.state);

    if(board[move.x][move.y] !== '.'){
      throw new Error('Cell is already occupied');
    }

    board[move.x][move.y] = playerSymbol;

    const win = this.checkWin(board, move.x, move.y, playerSymbol);

    if(win){
      await this.prisma.game.update({
        where: {id: game.id},
        data: {won: true},
      })
    }

    await this.prisma.game.update({
      where: {id: game.id},
      data: {state: JSON.stringify(board)}
    });

    return {board, win};
  }

  async delGame(sessionId: string){
    const game = await this.prisma.game.findFirst({
      where: { OR: [{session1: sessionId}, {session2: sessionId}]}
    });
    if (!game){
      throw new NotFoundException('Game not found');
    }

    await this.prisma.game.delete({
      where: { id: game.id }
    });
  }

  checkWin(board: any[][], x: number, y: number, symbol: string){
    const rowWin = board[x].filter(cell => cell === symbol).length === 5;
    const colWin = board.filter(row => row[y] === symbol).length === 5;
    const diagWin = this.checkDiagWin(board, x, y, symbol);

    return rowWin || colWin || diagWin;
  }

  checkBoard(board: string[][]) {
    const size = board.length;
    const neededToWin = 5;

    const checkLine = (x: number, y: number, dx: number, dy: number) => {
      const symbol = board[x][y];
      let count = 1;

      let i = x + dx, j = y + dy;
      while (i >= 0 && i < size && j >= 0 && j < size && board[i][j] === symbol) {
        count++;
        i += dx;
        j += dy;
      }

      i = x - dx; j = y - dy;
      while (i >= 0 && i < size && j >= 0 && j < size && board[i][j] === symbol) {
        count++;
        i -= dx;
        j -= dy;
      }

      return count >= neededToWin;
    };

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        // Skip empty cells
        if (!board[x][y] || board[x][y] === '.') continue;

        if (checkLine(x, y, 1, 0) || // Horizontal
          checkLine(x, y, 0, 1) || // Vertical
          checkLine(x, y, 1, 1) || // Diagonal down-right
          checkLine(x, y, 1, -1)) { // Diagonal down-left
          return true; // Win found
        }
      }
    }

    return false; // No win found
  }

  initializeGameBoard() {
    return Array(8).fill(null).map(() => Array(8).fill('.'));
  }

  private checkDiagWin(board: any[][], x: number, y: number, symbol: string) {
    let count = 1;

    for(let i = 1; i < 5; i++) {  //start-move
      if(x-i < 0 || y-i < 0 || board[x-i][y-i] !== symbol) break;
      count++;
    }
    for(let i = 1; i < 5; i++) {  //move-end
      if(x+i >= 8 || y+i >= 8 || board[x+i][y+i] !== symbol) break;
      count++;
    }
    if(count >= 5) return true;

    count = 1;

    for(let i = 1; i < 5; i++) {  //top-right-move
      if(x-i < 0 || y+i >= 8 || board[x-i][y+i] !== symbol) break;
      count++;
    }
    for(let i = 1; i < 5; i++) {
      if(x+i >= 8 || y-i < 0 || board[x+i][y-i] !== symbol) break;
      count++;
    }
    return count >= 5;
  }
}
