const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');

const app = express();
const prisma = new PrismaClient();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 100 requests per windowMs
});

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});
const upload = multer({ storage });

app.use(limiter);
app.use(cors());
app.use(bodyParser.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.post('/api/articles', upload.single('image'), async (req, res) => {
  const { title, text, author } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        text,
        author,
        image: imagePath, // Save image path to the database
      },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});