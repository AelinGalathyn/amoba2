import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { MoveDto } from "./move.dto";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {
  }

  @Get(":sessionId")
  async getGameState(@Param("sessionId") sessionId: number) {
    const gameState = await this.gameService.getGameState(+sessionId);
    return gameState;
  }


  @Post(":sessionId/play")
  async play(@Param('sessionId') sessionId: number, @Body() move: MoveDto) {
    const ret = await this.gameService.play(+sessionId, move);
    return ret;
  }
}
