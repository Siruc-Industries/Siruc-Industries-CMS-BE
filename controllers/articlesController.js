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
  let { title, text, author, tabs, imageDescription } = req.body;
  const imageUrl = req.file ? req.file.path : null;
  // Safely parse tabs if it exists, otherwise set to null
  let parsedTabs = null;
  if (tabs && tabs !== 'undefined') {
    try {
      parsedTabs = JSON.parse(tabs);
    } catch (parseError) {
      console.error('Error parsing tabs:', parseError);
      parsedTabs = null;
    }
  }
  
  try {
    const newArticle = await prisma.article.create({
      data: { title, text, author, image: imageUrl, tabs: parsedTabs, imageDescription },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
};

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, text, author, tabs } = req.body;
  
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

    // Safely handle tabs if provided
    if (tabs && tabs !== 'undefined') {
      try {
        updateData.tabs = JSON.parse(tabs);
      } catch (parseError) {
        console.error('Error parsing tabs:', parseError);
        // If parsing fails, don't update tabs
      }
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
