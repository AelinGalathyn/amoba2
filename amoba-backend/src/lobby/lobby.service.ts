import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LobbyService {
  constructor(private prisma: PrismaService) {}

  async joinOrCreate(req: any){
    let gameStarted = false;
    let sessionId: string;
    if(!req.cookies['sessionId']) {
      sessionId = req.sessionID;
    }else {
      sessionId = req.cookies['sessionId'];
    }

    const existingLobby = await this.prisma.lobbyEntry.findFirst();
    const existingGame = await this.prisma.game.findFirst({
      where:{ OR:[
          {session1: sessionId},
          {session2: sessionId}]
      }});

    if (existingLobby){
      if(existingLobby.sessionId!==sessionId) {
        await this.prisma.lobbyEntry.delete({
          where: { id: existingLobby.id }
        });

        await this.prisma.game.create({
          data: {
            session1: existingLobby.sessionId,
            session2: sessionId,
            state: "",
          }
        });

        gameStarted = true;
      }
    }
    else if(existingGame){
      gameStarted = true
    }
    else {
      await this.prisma.lobbyEntry.create({data: {sessionId}});
    }

    return {gameStarted, sessionId};
  }
}
