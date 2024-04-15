import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LobbyService implements OnModuleInit{
  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    setInterval(async () => {
      const lobby = await this.prisma.lobbyEntry.findFirst();
      if(lobby) {
        if ((Date.now() - lobby.timestamp.getTime())/1000 >= 10) {
          await this.prisma.lobbyEntry.delete({ where: { id: lobby.id } });
        }
      }
    }, 5000);
  }

  async joinOrCreate(sessionId?: number){
    let gameStarted = false;
    if(!sessionId) {
      sessionId = Math.round(Math.random()*10000)+1;
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
            state: JSON.stringify(Array(8).fill(null).map(() => Array(8).fill("."))),
          }
        });

        gameStarted = true;
      }
      else {
        await this.prisma.lobbyEntry.update({
          where: {id: existingLobby.id},
          data: {timestamp: new Date()}
        });
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
