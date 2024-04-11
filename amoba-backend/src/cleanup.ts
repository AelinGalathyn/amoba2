import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Assuming `User` and `Post` are models in your schema
  // Adjust according to your actual models
  await prisma.lobbyEntry.deleteMany({});
  await prisma.game.deleteMany({});
  console.log('Database cleared');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
