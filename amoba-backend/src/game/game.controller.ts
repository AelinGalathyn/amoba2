import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { GameService } from './game.service';
import { MoveDto } from "./move.dto";
import { Request, Response } from "express";
let check =0;

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async getGameState(@Req() req: Request, @Res() res: Response) {
    check += 1;
    try {
      const sessionId = req.cookies['sessionId'];
      const gameState = await this.gameService.getGameState(sessionId);
      return res.send(gameState);
    } catch {
      res.cookie('sessionId', '', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        expires: new Date(0)
      });
      return res.send;
    }
  }


  @Post('/play')
  async play(@Req() req: Request, @Res() res: Response, @Body() move: MoveDto){
    const sessionId = req.cookies['sessionId'];
    try {
      const ret = await this.gameService.play(sessionId, move);
      if (ret.win) {
        await this.gameService.delGame(sessionId);
        this.clearSessionCookie(res);
      }
      return res.send(ret);
    } catch (error) {
      console.error("Error during play:", error);
      this.clearSessionCookie(res);
      return res.status(500).json({ error: "An error occurred" });
    }
  }

  clearSessionCookie = (res: Response) => {
    return res.cookie('sessionId', '', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      expires: new Date(0)
    });
  };
}
