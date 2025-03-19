const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
const { ethers } = require('ethers');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const crypto = require('crypto');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'palestine_news',
  user: process.env.DB_USER || 'zeeshankhan',
  password: process.env.DB_PASSWORD || '',
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

// Blockchain connection
let provider;
let contract;

try {
  // Check if contract_abi.json exists
  try {
    const contractABI = require('../crawler/contract_abi.json');
    provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || 'https://polygon-rpc.com');
    
    if (process.env.CONTRACT_ADDRESS) {
      contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        contractABI,
        provider
      );
      console.log('Connected to blockchain contract');
    } else {
      console.warn('CONTRACT_ADDRESS not set. Blockchain verification disabled.');
    }
  } catch (error) {
    console.warn('Contract ABI not found. Blockchain verification disabled.');
  }
} catch (error) {
  console.error('Error setting up blockchain connection:', error.message);
}

// Routes

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    console.log(`Fetching articles: page=${page}, limit=${limit}, offset=${offset}`);
    
    const result = await pool.query(
      `SELECT id, title, source_url, source_name, publication_date, 
       content_hash, blockchain_tx_hash, created_at 
       FROM articles 
       ORDER BY publication_date DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    console.log(`Found ${result.rows.length} articles`);
    
    const countResult = await pool.query('SELECT COUNT(*) FROM articles');
    const totalArticles = parseInt(countResult.rows[0].count);
    
    console.log(`Total articles in database: ${totalArticles}`);
    
    res.json({
      articles: result.rows,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get a single article by ID
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Submit a new article
app.post(
  '/api/articles',
  [
    body('url').isURL().withMessage('Valid URL is required'),
    body('title').optional().isString().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').optional().isString().trim()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { url, title: userTitle, description } = req.body;
    
    try {
      // Check if article already exists
      const existingArticle = await pool.query(
        'SELECT id FROM articles WHERE source_url = $1',
        [url]
      );
      
      if (existingArticle.rows.length > 0) {
        return res.status(409).json({ 
          error: 'Article already exists',
          articleId: existingArticle.rows[0].id
        });
      }
      
      // Fetch article content
      const response = await axios.get(url);
      const html = response.data;
      
      // Extract article data (simplified version - in production use newspaper or similar)
      // This is a placeholder for actual article extraction logic
      const title = userTitle || extractTitle(html);
      const content = extractContent(html);
      const sourceName = extractDomain(url);
      
      // Generate content hash
      const contentHash = crypto.createHash('sha256').update(content).digest('hex');
      
      // Store in database
      const result = await pool.query(
        `INSERT INTO articles (
          title, source_url, source_name, publication_date,
          content_text, content_hash
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          title,
          url,
          sourceName,
          new Date(),
          content,
          contentHash
        ]
      );
      
      const articleId = result.rows[0].id;
      
      // Submit to blockchain if configured
      if (contract && process.env.PRIVATE_KEY) {
        try {
          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
          const contractWithSigner = contract.connect(wallet);
          
          const tx = await contractWithSigner.storeArticleHash(
            contentHash,
            url,
            Math.floor(Date.now() / 1000)
          );
          
          await tx.wait();
          
          // Update database with transaction hash
          await pool.query(
            'UPDATE articles SET blockchain_tx_hash = $1 WHERE id = $2',
            [tx.hash, articleId]
          );
          
          res.status(201).json({
            message: 'Article submitted and verified on blockchain',
            articleId,
            blockchainTxHash: tx.hash
          });
        } catch (blockchainError) {
          console.error('Blockchain submission error:', blockchainError);
          res.status(201).json({
            message: 'Article submitted but blockchain verification failed',
            articleId,
            error: blockchainError.message
          });
        }
      } else {
        res.status(201).json({
          message: 'Article submitted (blockchain verification not configured)',
          articleId
        });
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      res.status(500).json({ error: 'Failed to submit article' });
    }
  }
);

// Verify article content
app.post('/api/verify', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Generate hash of the provided content
    const contentHash = crypto.createHash('sha256').update(content).digest('hex');
    
    // Check database
    const result = await pool.query(
      'SELECT id, title, source_url, source_name, publication_date, blockchain_tx_hash FROM articles WHERE content_hash = $1',
      [contentHash]
    );
    
    if (result.rows.length === 0) {
      return res.json({
        verified: false,
        message: 'Content not found in our database'
      });
    }
    
    const article = result.rows[0];
    
    // Check blockchain if configured
    let blockchainVerified = false;
    let blockchainData = null;
    
    if (contract && article.blockchain_tx_hash) {
      try {
        blockchainVerified = await contract.isArticleHashStored(contentHash);
        
        if (blockchainVerified) {
          const data = await contract.getArticleData(contentHash);
          blockchainData = {
            sourceUrl: data[0],
            timestamp: new Date(data[1] * 1000).toISOString(),
            submitter: data[2]
          };
        }
      } catch (blockchainError) {
        console.error('Blockchain verification error:', blockchainError);
      }
    }
    
    res.json({
      verified: true,
      article,
      blockchain: {
        verified: blockchainVerified,
        data: blockchainData
      }
    });
  } catch (error) {
    console.error('Error verifying content:', error);
    res.status(500).json({ error: 'Failed to verify content' });
  }
});

// Helper functions for article extraction
function extractTitle(html) {
  // Simple extraction - in production use a proper library
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? match[1] : 'Untitled Article';
}

function extractContent(html) {
  // Simple extraction - in production use a proper library
  // Remove HTML tags and get text content
  const text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

function extractDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
