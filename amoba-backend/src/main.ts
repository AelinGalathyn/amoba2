import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.lobbyEntry.deleteMany({});
  await prisma.game.deleteMany({});
  console.log('Database cleared');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await clearDatabase();
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  });
  await app.listen(3000);
}
bootstrap();
