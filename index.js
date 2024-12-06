const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('./middlewares/rateLimiter');
const articlesRouter = require('./routes/articles');

const app = express();

app.use(cors());
app.use(rateLimit);

// Serve static files
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());

// Mount the articles routes
app.use('/api/articles', articlesRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
