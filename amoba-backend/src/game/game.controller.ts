import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { GameService } from "./game.service";
import { MoveDto } from "./move.dto";
import { Request, Response } from "express";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {
  }

  @Get()
  async getGameState(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies["sessionId"];
    const gameState = await this.gameService.getGameState(sessionId);
    if (gameState.win === true) {
      res = this.clearSessionCookie(res);
    }
    return res.send(gameState);
  }


  @Post("/play")
  async play(@Req() req: Request, @Res() res: Response, @Body() move: MoveDto) {
    const sessionId = req.cookies["sessionId"];
    const ret = await this.gameService.play(sessionId, move);
    if (ret.win) {
      res = this.clearSessionCookie(res);
    }
    return res.send(ret);
  }

  clearSessionCookie = (res: Response) => {
    return res.cookie("sessionId", "", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      expires: new Date(0)
    });
  };
}
