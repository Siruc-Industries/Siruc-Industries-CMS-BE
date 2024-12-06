const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching articles');
  }
};

exports.getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({ where: { id: parseInt(id, 10) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching article');
  }
};

exports.createArticle = async (req, res) => {
  const { title, text, author } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newArticle = await prisma.article.create({
      data: { title, text, author, image: imagePath },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
};

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, text, author } = req.body;
  
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Prepare the data to be updated
    const updateData = {
      title,
      text,
      author,
    };

    // If a new image is uploaded, include it in the update
    if (imagePath) {
      updateData.image = imagePath;
    }

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });
    
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating article');
  }
};

exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.article.delete({ where: { id: parseInt(id, 10) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting article');
  }
};
