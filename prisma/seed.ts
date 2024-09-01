import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

// Seed Data
import { user, asset } from './seed-data';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Rounds Of Hashing
const roundsOfHashing = 7;

async function main() {
  // await prisma.user.createMany({
  //   data: user,
  // });
  // console.log('Added user data');

  const passwordUser1 = await bcrypt.hash('Hifaaz@17112023', roundsOfHashing);
  const passwordUser2 = await bcrypt.hash('TestUser@9876', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'hmhwebdev@gmail.com' },
    update: {},
    create: {
      name: 'Mohamed Hisham',
      email: 'hmhwebdev@gmail.com',
      password: passwordUser1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test_user@mail.com' },
    update: {},
    create: {
      email: 'test_user@mail.com',
      name: 'Test User',
      password: passwordUser2,
    },
  });

  await prisma.asset.createMany({
    data: asset,
  });
  console.log('Added company data');
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
