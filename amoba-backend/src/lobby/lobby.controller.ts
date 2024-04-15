import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { LobbyService } from "./lobby.service";
import { Request, Response } from "express";
import session from "express-session";

@Controller("lobby")
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {
  }

  @Post()
  async joinLobby(@Body() body: { sessionId?: number }) {
    return await this.lobbyService.joinOrCreate(body.sessionId);
  }
}
