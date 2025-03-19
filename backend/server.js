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
let testingMode = process.env.REACT_APP_TESTING_MODE === 'true';

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
      console.warn('CONTRACT_ADDRESS not set. Blockchain verification will use mock data in testing mode.');
      testingMode = true;
    }
  } catch (error) {
    console.warn('Contract ABI not found. Blockchain verification will use mock data in testing mode.');
    testingMode = true;
  }
} catch (error) {
  console.error('Error setting up blockchain connection:', error.message);
  testingMode = true;
}

// Mock blockchain data for testing mode
const mockBlockchainData = {
  articles: {},
  users: {
    // Some pre-verified test addresses
    '0x123456789abcdef123456789abcdef123456789a': { verified: true, role: 1 },
    '0x987654321fedcba987654321fedcba987654321f': { verified: true, role: 2 }
  }
};

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
    const { content, url, hash } = req.body;
    
    if (!content && !url && !hash) {
      return res.status(400).json({ error: 'Content, URL, or hash is required' });
    }
    
    let contentHash = hash;
    let articleData = null;
    
    // If content is provided, generate hash
    if (content) {
      contentHash = crypto.createHash('sha256').update(content).digest('hex');
    }
    
    // If URL is provided, fetch content and generate hash
    if (url && !content) {
      try {
        const response = await axios.get(url);
        const html = response.data;
        const extractedContent = extractContent(html);
        contentHash = crypto.createHash('sha256').update(extractedContent).digest('hex');
      } catch (fetchError) {
        return res.status(400).json({ error: 'Failed to fetch URL content' });
      }
    }
    
    // Check database for the hash
    const result = await pool.query(
      'SELECT * FROM articles WHERE content_hash = $1',
      [contentHash]
    );
    
    if (result.rows.length > 0) {
      articleData = result.rows[0];
    }
    
    // Check blockchain for verification
    let blockchainVerified = false;
    let blockchainData = null;
    
    if (contract && contentHash) {
      try {
        const onChainData = await contract.getArticleData(contentHash);
        
        if (onChainData && onChainData.url && onChainData.url !== '') {
          blockchainVerified = true;
          blockchainData = {
            url: onChainData.url,
            timestamp: new Date(onChainData.timestamp.toNumber() * 1000).toISOString()
          };
        }
      } catch (blockchainError) {
        console.error('Blockchain verification error:', blockchainError);
      }
    } else if (testingMode) {
      // In testing mode, simulate blockchain verification
      console.log('Using mock blockchain verification in testing mode');
      
      // If the article exists in the database, consider it verified in testing mode
      if (articleData) {
        blockchainVerified = true;
        
        // Create mock blockchain data
        if (!mockBlockchainData.articles[contentHash]) {
          mockBlockchainData.articles[contentHash] = {
            url: articleData.source_url,
            timestamp: articleData.created_at.toISOString()
          };
        }
        
        blockchainData = mockBlockchainData.articles[contentHash];
      }
    }
    
    res.json({
      verified: !!articleData || blockchainVerified,
      source: articleData ? 'database' : (blockchainVerified ? 'blockchain' : null),
      article: articleData,
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

// User verification endpoints
app.post('/api/users/verify', async (req, res) => {
  try {
    const { address, signature } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // In production, verify the signature against the message
    // For testing mode, we'll just check if the address is in our mock data
    
    let verified = false;
    let role = 0; // Unassigned by default
    
    if (contract && !testingMode) {
      try {
        // In production, call the contract to verify the user
        verified = await contract.isVerified(address);
        if (verified) {
          role = await contract.getUserRole(address);
        }
      } catch (blockchainError) {
        console.error('Blockchain user verification error:', blockchainError);
      }
    } else if (testingMode) {
      // In testing mode, use mock data
      console.log('Using mock user verification in testing mode for address:', address);
      
      // Convert address to lowercase for case-insensitive comparison
      const normalizedAddress = address.toLowerCase();
      
      // Check if the address is in our mock data
      // If not, automatically add it as a verified user in testing mode
      if (!mockBlockchainData.users[normalizedAddress]) {
        mockBlockchainData.users[normalizedAddress] = { 
          verified: true, 
          role: 1 // Reader role by default
        };
        console.log('Added new test user:', normalizedAddress);
      }
      
      verified = mockBlockchainData.users[normalizedAddress].verified;
      role = mockBlockchainData.users[normalizedAddress].role;
    }
    
    res.json({
      address,
      verified,
      role
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

// Update user role (admin only in production, anyone in testing)
app.post('/api/users/role', async (req, res) => {
  try {
    const { address, role } = req.body;
    
    if (!address || role === undefined) {
      return res.status(400).json({ error: 'Address and role are required' });
    }
    
    if (testingMode) {
      // In testing mode, allow role changes
      const normalizedAddress = address.toLowerCase();
      
      if (!mockBlockchainData.users[normalizedAddress]) {
        mockBlockchainData.users[normalizedAddress] = { verified: true, role: 0 };
      }
      
      mockBlockchainData.users[normalizedAddress].role = role;
      console.log(`Updated test user ${normalizedAddress} role to ${role}`);
      
      res.json({
        success: true,
        address,
        role
      });
    } else {
      // In production, this would require admin authentication
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
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
