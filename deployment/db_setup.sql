-- Database setup for Palestine News Hub

-- Create database
CREATE DATABASE palestine_news;

-- Connect to the database
\c palestine_news;

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    source_url TEXT NOT NULL UNIQUE,
    source_name TEXT NOT NULL,
    publication_date TIMESTAMP,
    content_text TEXT,
    content_hash TEXT NOT NULL,
    blockchain_tx_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on content_hash for faster verification
CREATE INDEX IF NOT EXISTS idx_articles_content_hash ON articles (content_hash);

-- Create index on publication_date for sorting
CREATE INDEX IF NOT EXISTS idx_articles_publication_date ON articles (publication_date DESC);

-- Create a dedicated user for the application
CREATE USER palestine_news_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE palestine_news TO palestine_news_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO palestine_news_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO palestine_news_user;
