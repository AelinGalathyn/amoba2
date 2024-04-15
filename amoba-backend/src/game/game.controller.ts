import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { MoveDto } from "./move.dto";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {
  }

  @Get(":sessionId")
  async getGameState(@Param("sessionId") sessionId: number) {
    return await this.gameService.getGameState(+sessionId);
  }


  @Post(":sessionId/play")
  async play(@Param('sessionId') sessionId: number, @Body() move: MoveDto) {
    return await this.gameService.play(+sessionId, move);
  }
}
