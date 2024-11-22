const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');

const app = express();
const prisma = new PrismaClient();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Siruć Industries CMS API');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/articles', async (req, res) => {
  try {
      const articles = await prisma.article.findMany();
      res.json(articles);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching articles');
  }
});

app.post('/api/articles', async (req, res) => {
  const { title, text, author } = req.body;

  try {
      const newArticle = await prisma.article.create({
          data: { title, text, author },
      });
      res.status(201).json(newArticle);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error creating article');
  }
});