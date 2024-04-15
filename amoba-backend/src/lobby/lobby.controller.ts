import { Body, Controller, Post } from "@nestjs/common";
import { LobbyService } from "./lobby.service";

@Controller("lobby")
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {
  }

  @Post()
  async joinLobby(@Body() body: { sessionId?: number }) {
    return await this.lobbyService.joinOrCreate(body.sessionId);
  }
}
