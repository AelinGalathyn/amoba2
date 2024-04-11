import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { LobbyModule } from './lobby/lobby.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [PrismaModule, LobbyModule, GameModule],
  providers: [PrismaService],
})
export class AppModule {}
