const express = require('express');
const router = express.Router();

// API routes
router.get('/status', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Articles routes
router.get('/articles', (req, res) => {
  res.json({ 
    articles: [
      { 
        id: 1, 
        title: 'Sample Article', 
        source: 'Example News',
        url: 'https://example.com/article',
        publishedAt: new Date().toISOString(),
        hash: '0x123456789abcdef',
        verified: true
      }
    ] 
  });
});

module.exports = router;
