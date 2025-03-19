#!/usr/bin/env python3
"""
Palestine News Hub - Web Crawler

This script crawls trusted news sources for articles about Palestine,
extracts metadata, generates content hashes, and stores them in PostgreSQL
and on the Polygon blockchain.
"""

import os
import hashlib
import json
import time
import logging
import schedule
from datetime import datetime
from typing import Dict, List, Any, Optional

import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from bs4 import BeautifulSoup
from newspaper import Article
from dotenv import load_dotenv
from web3 import Web3

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("crawler.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Database connection parameters
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "palestine_news")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# Blockchain connection parameters
POLYGON_RPC = os.getenv("POLYGON_RPC", "https://polygon-rpc.com")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "")

# Trusted news sources
TRUSTED_SOURCES = [
    {
        "name": "Al Jazeera",
        "url": "https://www.aljazeera.com/tag/palestine/",
        "article_selector": "article.gc a",
        "base_url": "https://www.aljazeera.com"
    },
    {
        "name": "Middle East Eye",
        "url": "https://www.middleeasteye.net/topics/palestine",
        "article_selector": "article.teaser h3 a",
        "base_url": "https://www.middleeasteye.net"
    }
]

class PalestineNewsCrawler:
    """Web crawler for Palestine news articles."""
    
    def __init__(self):
        """Initialize the crawler with database and blockchain connections."""
        self.conn = None
        self.web3 = None
        self.contract = None
        self.setup_database()
        self.setup_blockchain()
    
    def setup_database(self):
        """Set up the PostgreSQL database connection."""
        try:
            self.conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD
            )
            logger.info("Connected to PostgreSQL database")
            
            # Create articles table if it doesn't exist
            with self.conn.cursor() as cursor:
                cursor.execute("""
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
                )
                """)
                self.conn.commit()
                logger.info("Articles table created or already exists")
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            raise
    
    def setup_blockchain(self):
        """Set up the connection to the Polygon blockchain."""
        try:
            if not CONTRACT_ADDRESS or not PRIVATE_KEY:
                logger.warning("Blockchain integration disabled: missing contract address or private key")
                return
            
            self.web3 = Web3(Web3.HTTPProvider(POLYGON_RPC))
            if not self.web3.is_connected():
                logger.error("Failed to connect to Polygon network")
                return
            
            logger.info(f"Connected to Polygon: {self.web3.is_connected()}")
            
            # Load contract ABI
            try:
                with open('contract_abi.json', 'r') as f:
                    contract_abi = json.load(f)
                self.contract = self.web3.eth.contract(
                    address=CONTRACT_ADDRESS,
                    abi=contract_abi
                )
                logger.info("Contract loaded successfully")
            except Exception as e:
                logger.error(f"Failed to load contract: {e}")
        except Exception as e:
            logger.error(f"Blockchain setup error: {e}")
    
    def fetch_article_links(self, source: Dict[str, str]) -> List[str]:
        """
        Fetch article links from a news source.
        
        Args:
            source: Dictionary containing source information
            
        Returns:
            List of article URLs
        """
        try:
            response = requests.get(source["url"], timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            links = []
            for link in soup.select(source["article_selector"]):
                href = link.get('href')
                if href:
                    # Handle relative URLs
                    if href.startswith('/'):
                        href = f"{source['base_url']}{href}"
                    links.append(href)
            
            logger.info(f"Found {len(links)} articles from {source['name']}")
            return links
        except Exception as e:
            logger.error(f"Error fetching articles from {source['name']}: {e}")
            return []
    
    def extract_article_data(self, url: str, source_name: str) -> Optional[Dict[str, Any]]:
        """
        Extract article data using newspaper3k.
        
        Args:
            url: Article URL
            source_name: Name of the news source
            
        Returns:
            Dictionary containing article data or None if extraction failed
        """
        try:
            article = Article(url)
            article.download()
            article.parse()
            
            # Generate SHA-256 hash of the article content
            content_hash = hashlib.sha256(article.text.encode()).hexdigest()
            
            # Extract publication date or use current time if not available
            pub_date = article.publish_date or datetime.now()
            
            return {
                "title": article.title,
                "source_url": url,
                "source_name": source_name,
                "publication_date": pub_date,
                "content_text": article.text,
                "content_hash": content_hash
            }
        except Exception as e:
            logger.error(f"Error extracting data from {url}: {e}")
            return None
    
    def store_article(self, article_data: Dict[str, Any]) -> Optional[int]:
        """
        Store article data in PostgreSQL.
        
        Args:
            article_data: Dictionary containing article data
            
        Returns:
            Article ID if successful, None otherwise
        """
        try:
            with self.conn.cursor() as cursor:
                # Check if article already exists
                cursor.execute(
                    "SELECT id FROM articles WHERE source_url = %s",
                    (article_data["source_url"],)
                )
                existing = cursor.fetchone()
                if existing:
                    logger.info(f"Article already exists: {article_data['title']}")
                    return existing[0]
                
                # Insert new article
                cursor.execute("""
                INSERT INTO articles (
                    title, source_url, source_name, publication_date,
                    content_text, content_hash
                ) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
                """, (
                    article_data["title"],
                    article_data["source_url"],
                    article_data["source_name"],
                    article_data["publication_date"],
                    article_data["content_text"],
                    article_data["content_hash"]
                ))
                article_id = cursor.fetchone()[0]
                self.conn.commit()
                logger.info(f"Stored article: {article_data['title']} (ID: {article_id})")
                return article_id
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Error storing article: {e}")
            return None
    
    def submit_to_blockchain(self, article_id: int, article_data: Dict[str, Any]) -> bool:
        """
        Submit article hash to Polygon blockchain.
        
        Args:
            article_id: Article ID in the database
            article_data: Dictionary containing article data
            
        Returns:
            True if successful, False otherwise
        """
        if not self.web3 or not self.contract or not PRIVATE_KEY:
            logger.warning("Blockchain integration disabled")
            return False
        
        try:
            account = self.web3.eth.account.from_key(PRIVATE_KEY)
            
            # Prepare transaction
            tx = self.contract.functions.storeArticleHash(
                article_data["content_hash"],
                article_data["source_url"],
                int(article_data["publication_date"].timestamp())
            ).build_transaction({
                'from': account.address,
                'nonce': self.web3.eth.get_transaction_count(account.address),
                'gas': 200000,
                'gasPrice': self.web3.eth.gas_price
            })
            
            # Sign and send transaction
            signed_tx = self.web3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = self.web3.eth.send_raw_transaction(signed_tx.rawTransaction)
            tx_receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Update database with transaction hash
            with self.conn.cursor() as cursor:
                cursor.execute(
                    "UPDATE articles SET blockchain_tx_hash = %s WHERE id = %s",
                    (tx_hash.hex(), article_id)
                )
                self.conn.commit()
            
            logger.info(f"Article hash stored on blockchain: {tx_hash.hex()}")
            return True
        except Exception as e:
            logger.error(f"Error submitting to blockchain: {e}")
            return False
    
    def crawl_sources(self):
        """Crawl all trusted sources for articles."""
        for source in TRUSTED_SOURCES:
            logger.info(f"Crawling {source['name']}...")
            article_links = self.fetch_article_links(source)
            
            for url in article_links:
                # Check if article already exists
                with self.conn.cursor() as cursor:
                    cursor.execute(
                        "SELECT id FROM articles WHERE source_url = %s",
                        (url,)
                    )
                    if cursor.fetchone():
                        logger.info(f"Skipping existing article: {url}")
                        continue
                
                # Extract and store article data
                article_data = self.extract_article_data(url, source["name"])
                if article_data:
                    article_id = self.store_article(article_data)
                    if article_id and self.web3 and self.contract:
                        self.submit_to_blockchain(article_id, article_data)
                
                # Sleep to avoid overwhelming the server
                time.sleep(2)
    
    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")

def run_crawler():
    """Run the crawler as a scheduled job."""
    logger.info("Starting crawler job")
    crawler = PalestineNewsCrawler()
    try:
        crawler.crawl_sources()
    finally:
        crawler.close()
    logger.info("Crawler job completed")

def main():
    """Main function to run the crawler on a schedule."""
    logger.info("Palestine News Crawler starting up")
    
    # Run immediately on startup
    run_crawler()
    
    # Schedule to run every 6 hours
    schedule.every(6).hours.do(run_crawler)
    
    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()
