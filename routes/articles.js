const express = require('express');
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articlesController');
// shared upload middleware Multer for image upload
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', upload.single('image'), createArticle);
router.put('/:id', upload.single('image'), updateArticle);
router.delete('/:id', deleteArticle);

module.exports = router;
