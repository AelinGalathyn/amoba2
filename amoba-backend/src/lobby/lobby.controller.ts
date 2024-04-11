import { Controller, Get, Req, Res } from "@nestjs/common";
import { LobbyService } from './lobby.service';
import {Request, Response} from "express";

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Get()
  async joinLobby(@Req() req: Request, @Res() res: Response){
    const {gameStarted, sessionId} = await this.lobbyService.joinOrCreate(req);
    if(!req.cookies['sessionId']){
      res.cookie('sessionId', sessionId,{
        httpOnly: true,
        path: '/',
        sameSite: "lax",
        }
      );
    }
    return res.json({ gameStarted });
  }
}
