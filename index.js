const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.json({message: 'alive'});
});

app.get('/quotes', async (req, res) => {
  const currentPage = req.query.page || 1;
  const listPerPage = 5;
  const offset = (currentPage - 1) * listPerPage;
  
  const allQuotes =  await prisma.quote.findMany({
    include: { author: true },
    skip: offset,
    take: listPerPage,
  });
  
  res.json({
    data: allQuotes,
    meta: {page: currentPage}
  });
});

app.post('/quotes', async (req, res) => {
  const authorName = req.body.author;
  const quote = {
    quote: req.body.quote
  };

  if (!authorName || !quote.quote) {
    return res.status(400).json({message: 'Either quote or author is missing'});
  }

  try {
    const message = 'quote created successfully';
    const author = await prisma.author.findFirst({
      where: { name: authorName }
    });

    if(!author) {
      await prisma.author.create({ 
        data: {
          'name': authorName,
          Quotes: {
            create: quote
          }
        }
      });

      console.log('Created author and then the related quote');
      return res.json({message});
    }

    await prisma.quote.create({
      data: {
        quote: quote.quote,
        author: { connect: { name: authorName } }
      }
    });

    console.log('Created quote for an existing author');
    return res.json({message});
  } catch(e) {
    console.error(e);
    return res.status(500).json({message: 'something went wrong'});
  }
});

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
