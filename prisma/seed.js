const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async function main() {
  try {
    const martinFowler = await prisma.author.upsert({
      where: { name: 'Martin Fowler' },
      update: {},
      create: {
        name: 'Martin Fowler',
        Quotes: {
          create: [
            {
              quote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
            },
            {
              quote: `I'm not a great programmer; I'm just a good programmer with great habits.`,
            },
          ],
        },
      },
    });
  
    console.log('Create 1 author with 2 quotes: ', martinFowler);
  } catch(e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
