const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('./middlewares/rateLimiter');
const articlesRouter = require('./routes/articles');
const projectsRouter = require('./routes/projects');

const app = express();

// CORS configuration for both local and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://127.0.0.1:3000',
      'https://sirucindustries.com',
      'https://www.sirucindustries.com',
      'https://cms.sirucindustries.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(rateLimit);

// Serve static files
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());

// Health check endpoint
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Mount the articles routes
app.use('/api/articles', articlesRouter);

// Mount the projects routes
app.use('/api/projects', projectsRouter);

const PORT = 5000; // Force port 5000 for local development

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
