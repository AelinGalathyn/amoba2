import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import * as express from 'express';


const prisma = new PrismaClient();
const app = express();
const port = 3000; // or whatever your port is

async function clearDatabase() {
  // The same deletion logic as in prismaCleanup.ts
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
