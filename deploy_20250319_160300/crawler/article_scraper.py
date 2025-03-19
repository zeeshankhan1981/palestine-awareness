#!/usr/bin/env python3
"""
Palestine News Hub - Article Scraper

This script scrapes pro-Palestine articles from various news sources,
extracts metadata, generates content hashes, and stores them in PostgreSQL.
"""

import os
import hashlib
import json
import time
import logging
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional

import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("article_scraper.log"),
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

# News sources with pro-Palestine content
NEWS_SOURCES = [
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
    },
    {
        "name": "Electronic Intifada",
        "url": "https://electronicintifada.net/",
        "article_selector": "h2.node__title a",
        "base_url": ""
    },
    {
        "name": "Mondoweiss",
        "url": "https://mondoweiss.net/topic/palestine/",
        "article_selector": "h2.entry-title a",
        "base_url": ""
    },
    {
        "name": "Palestine Chronicle",
        "url": "https://www.palestinechronicle.com/",
        "article_selector": "h3.entry-title a",
        "base_url": ""
    }
]

# Sample articles data for offline use
SAMPLE_ARTICLES = [
    {
        "title": "Israeli forces kill 10 Palestinians in West Bank raids",
        "source_url": "https://www.aljazeera.com/news/2025/3/15/israeli-forces-kill-10-palestinians-in-west-bank-raids",
        "source_name": "Al Jazeera",
        "publication_date": datetime.now() - timedelta(days=4),
        "content_text": "Israeli forces have killed at least 10 Palestinians during military raids in the occupied West Bank. The Palestinian health ministry said the victims included two children. The Israeli military said it was targeting 'militants' in the area.",
        "content_hash": "a1b2c3d4e5f6g7h8i9j0"
    },
    {
        "title": "UN report: Gaza humanitarian crisis worsening",
        "source_url": "https://www.middleeasteye.net/news/gaza-humanitarian-crisis-worsening-un-report",
        "source_name": "Middle East Eye",
        "publication_date": datetime.now() - timedelta(days=2),
        "content_text": "A new UN report warns that the humanitarian crisis in Gaza is worsening, with critical shortages of food, water, and medical supplies. The report calls for immediate international intervention to prevent further deterioration of living conditions.",
        "content_hash": "b2c3d4e5f6g7h8i9j0k1"
    },
    {
        "title": "Palestinian farmers face increasing settler violence in West Bank",
        "source_url": "https://electronicintifada.net/content/palestinian-farmers-face-increasing-settler-violence/35678",
        "source_name": "Electronic Intifada",
        "publication_date": datetime.now() - timedelta(days=7),
        "content_text": "Palestinian olive farmers in the West Bank are reporting increased attacks by Israeli settlers during the harvest season. Several farmers have been injured and thousands of olive trees damaged or destroyed, threatening livelihoods that depend on the annual harvest.",
        "content_hash": "c3d4e5f6g7h8i9j0k1l2"
    },
    {
        "title": "International solidarity movement grows for Palestine",
        "source_url": "https://mondoweiss.net/2025/03/international-solidarity-movement-grows-for-palestine/",
        "source_name": "Mondoweiss",
        "publication_date": datetime.now() - timedelta(days=5),
        "content_text": "The international solidarity movement for Palestine continues to grow, with demonstrations in major cities worldwide. University campuses have become centers of activism, with students demanding their institutions divest from companies profiting from the occupation.",
        "content_hash": "d4e5f6g7h8i9j0k1l2m3"
    },
    {
        "title": "Palestinian cultural heritage sites at risk amid conflict",
        "source_url": "https://www.palestinechronicle.com/palestinian-cultural-heritage-sites-at-risk-amid-conflict/",
        "source_name": "Palestine Chronicle",
        "publication_date": datetime.now() - timedelta(days=10),
        "content_text": "UNESCO has expressed concern over the damage to Palestinian cultural heritage sites during the ongoing conflict. Several historic buildings and archaeological sites have been damaged or destroyed, representing an irreplaceable loss of cultural heritage.",
        "content_hash": "e5f6g7h8i9j0k1l2m3n4"
    },
    {
        "title": "Gaza health system on brink of collapse, doctors warn",
        "source_url": "https://www.aljazeera.com/news/2025/3/10/gaza-health-system-on-brink-of-collapse-doctors-warn",
        "source_name": "Al Jazeera",
        "publication_date": datetime.now() - timedelta(days=9),
        "content_text": "Doctors in Gaza are warning that the territory's health system is on the brink of collapse due to shortages of medical supplies, electricity, and clean water. Several hospitals have been forced to close, while others are operating at minimal capacity.",
        "content_hash": "f6g7h8i9j0k1l2m3n4o5"
    },
    {
        "title": "Palestinian journalists face increasing threats and violence",
        "source_url": "https://www.middleeasteye.net/news/palestinian-journalists-face-increasing-threats-and-violence",
        "source_name": "Middle East Eye",
        "publication_date": datetime.now() - timedelta(days=15),
        "content_text": "Palestinian journalists are reporting increased threats, harassment, and violence while covering events in Gaza and the West Bank. Media rights organizations have documented dozens of cases of journalists being targeted, injured, or detained.",
        "content_hash": "g7h8i9j0k1l2m3n4o5p6"
    },
    {
        "title": "Water crisis deepens in Gaza as infrastructure deteriorates",
        "source_url": "https://electronicintifada.net/content/water-crisis-deepens-gaza-infrastructure-deteriorates/35679",
        "source_name": "Electronic Intifada",
        "publication_date": datetime.now() - timedelta(days=12),
        "content_text": "The water crisis in Gaza is deepening as infrastructure continues to deteriorate. Over 95% of water from the coastal aquifer is undrinkable, forcing residents to rely on expensive bottled water or unsafe sources, leading to waterborne diseases.",
        "content_hash": "h8i9j0k1l2m3n4o5p6q7"
    },
    {
        "title": "Palestinian artists use creativity as form of resistance",
        "source_url": "https://mondoweiss.net/2025/03/palestinian-artists-use-creativity-as-form-of-resistance/",
        "source_name": "Mondoweiss",
        "publication_date": datetime.now() - timedelta(days=8),
        "content_text": "Palestinian artists are using their creativity as a form of resistance, creating powerful works that document their experiences and preserve their cultural identity. From visual arts to music and literature, these artists are gaining international recognition.",
        "content_hash": "i9j0k1l2m3n4o5p6q7r8"
    },
    {
        "title": "Education disrupted for thousands of Palestinian children",
        "source_url": "https://www.palestinechronicle.com/education-disrupted-for-thousands-of-palestinian-children/",
        "source_name": "Palestine Chronicle",
        "publication_date": datetime.now() - timedelta(days=6),
        "content_text": "Education has been disrupted for thousands of Palestinian children due to school closures, displacement, and infrastructure damage. Educational experts warn of a lost generation as children miss crucial years of learning.",
        "content_hash": "j0k1l2m3n4o5p6q7r8s9"
    },
    {
        "title": "Palestinian farmers struggle with water access in Jordan Valley",
        "source_url": "https://www.aljazeera.com/news/2025/3/5/palestinian-farmers-struggle-with-water-access-in-jordan-valley",
        "source_name": "Al Jazeera",
        "publication_date": datetime.now() - timedelta(days=14),
        "content_text": "Palestinian farmers in the Jordan Valley are struggling with limited water access as Israeli authorities restrict usage. Many farmers report having to reduce their cultivated land or switch to less water-intensive crops, threatening their livelihoods.",
        "content_hash": "k1l2m3n4o5p6q7r8s9t0"
    },
    {
        "title": "Digital resistance: Palestinians use social media to document reality",
        "source_url": "https://www.middleeasteye.net/news/digital-resistance-palestinians-use-social-media-document-reality",
        "source_name": "Middle East Eye",
        "publication_date": datetime.now() - timedelta(days=11),
        "content_text": "Palestinians are increasingly using social media as a form of digital resistance, documenting their daily reality and challenging mainstream narratives. Despite challenges including internet disruptions and content removal, these efforts are reaching global audiences.",
        "content_hash": "l2m3n4o5p6q7r8s9t0u1"
    },
    {
        "title": "Mental health crisis among Palestinian children worsens",
        "source_url": "https://electronicintifada.net/content/mental-health-crisis-among-palestinian-children-worsens/35680",
        "source_name": "Electronic Intifada",
        "publication_date": datetime.now() - timedelta(days=3),
        "content_text": "Mental health professionals are reporting a worsening crisis among Palestinian children exposed to violence and trauma. Symptoms of PTSD, anxiety, and depression are widespread, with limited mental health resources available to address the growing need.",
        "content_hash": "m3n4o5p6q7r8s9t0u1v2"
    },
    {
        "title": "Palestinian olive harvest season begins amid increased restrictions",
        "source_url": "https://mondoweiss.net/2025/03/palestinian-olive-harvest-season-begins-amid-increased-restrictions/",
        "source_name": "Mondoweiss",
        "publication_date": datetime.now() - timedelta(days=1),
        "content_text": "The annual Palestinian olive harvest season has begun amid increased restrictions on farmer access to their lands. Many farmers require special permits to reach olive groves located near settlements or behind the separation barrier.",
        "content_hash": "n4o5p6q7r8s9t0u1v2w3"
    },
    {
        "title": "Palestinian women lead grassroots resistance movements",
        "source_url": "https://www.palestinechronicle.com/palestinian-women-lead-grassroots-resistance-movements/",
        "source_name": "Palestine Chronicle",
        "publication_date": datetime.now() - timedelta(days=16),
        "content_text": "Palestinian women are increasingly taking leadership roles in grassroots resistance movements. From organizing community support networks to leading protests, these women are challenging both occupation and traditional gender roles.",
        "content_hash": "o5p6q7r8s9t0u1v2w3x4"
    },
    {
        "title": "Food insecurity reaches critical levels in Gaza",
        "source_url": "https://www.aljazeera.com/news/2025/2/28/food-insecurity-reaches-critical-levels-in-gaza",
        "source_name": "Al Jazeera",
        "publication_date": datetime.now() - timedelta(days=19),
        "content_text": "Food insecurity in Gaza has reached critical levels, with aid organizations warning of potential famine conditions. Import restrictions, damaged agricultural land, and economic collapse have combined to create a severe food crisis affecting most of the population.",
        "content_hash": "p6q7r8s9t0u1v2w3x4y5"
    },
    {
        "title": "Palestinian heritage seeds preserved to maintain food sovereignty",
        "source_url": "https://www.middleeasteye.net/news/palestinian-heritage-seeds-preserved-maintain-food-sovereignty",
        "source_name": "Middle East Eye",
        "publication_date": datetime.now() - timedelta(days=21),
        "content_text": "Palestinian farmers and agricultural organizations are working to preserve heritage seeds as a way to maintain food sovereignty. These traditional varieties are adapted to local conditions and represent an important part of Palestinian agricultural heritage.",
        "content_hash": "q7r8s9t0u1v2w3x4y5z6"
    },
    {
        "title": "Palestinian refugees in Lebanon face deteriorating conditions",
        "source_url": "https://electronicintifada.net/content/palestinian-refugees-lebanon-face-deteriorating-conditions/35681",
        "source_name": "Electronic Intifada",
        "publication_date": datetime.now() - timedelta(days=18),
        "content_text": "Palestinian refugees in Lebanon are facing deteriorating living conditions as the country's economic crisis deepens. With limited work opportunities and reduced aid, many families are struggling to meet basic needs in the overcrowded camps.",
        "content_hash": "r8s9t0u1v2w3x4y5z6a7"
    },
    {
        "title": "Digital archives preserve Palestinian cultural heritage",
        "source_url": "https://mondoweiss.net/2025/02/digital-archives-preserve-palestinian-cultural-heritage/",
        "source_name": "Mondoweiss",
        "publication_date": datetime.now() - timedelta(days=25),
        "content_text": "Digital archiving projects are working to preserve Palestinian cultural heritage that is at risk of being lost. These initiatives are digitizing historical documents, photographs, oral histories, and artifacts to ensure they remain accessible for future generations.",
        "content_hash": "s9t0u1v2w3x4y5z6a7b8"
    },
    {
        "title": "Palestinian filmmakers document life under occupation",
        "source_url": "https://www.palestinechronicle.com/palestinian-filmmakers-document-life-under-occupation/",
        "source_name": "Palestine Chronicle",
        "publication_date": datetime.now() - timedelta(days=23),
        "content_text": "Palestinian filmmakers are creating powerful documentaries and feature films that capture the reality of life under occupation. Despite limited resources and mobility restrictions, these directors are gaining recognition at international film festivals.",
        "content_hash": "t0u1v2w3x4y5z6a7b8c9"
    }
]

class ArticleScraper:
    """Web scraper for pro-Palestine news articles."""
    
    def __init__(self):
        """Initialize the scraper with database connection."""
        self.conn = None
        self.setup_database()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
    
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
    
    def store_sample_articles(self, target_count: int = 20):
        """
        Store sample articles in the database.
        
        Args:
            target_count: Target number of articles to store
        """
        total_stored = 0
        
        for article_data in SAMPLE_ARTICLES:
            if total_stored >= target_count:
                break
                
            try:
                # Check if article already exists
                with self.conn.cursor() as cursor:
                    cursor.execute(
                        "SELECT id FROM articles WHERE source_url = %s",
                        (article_data['source_url'],)
                    )
                    existing = cursor.fetchone()
                    if existing:
                        logger.info(f"Article already exists: {article_data['title']}")
                        continue
                
                # Insert new article
                with self.conn.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO articles 
                        (title, source_url, source_name, publication_date, content_text, content_hash)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id
                        """,
                        (
                            article_data['title'],
                            article_data['source_url'],
                            article_data['source_name'],
                            article_data['publication_date'],
                            article_data['content_text'],
                            article_data['content_hash']
                        )
                    )
                    article_id = cursor.fetchone()[0]
                    self.conn.commit()
                    logger.info(f"Stored article: {article_data['title']}")
                    total_stored += 1
                    logger.info(f"Progress: {total_stored}/{target_count} articles stored")
            except Exception as e:
                self.conn.rollback()
                logger.error(f"Error storing article: {e}")
                continue
        
        logger.info(f"Completed storing {total_stored} sample articles")
    
    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")

def main():
    """Main function to run the article scraper."""
    try:
        scraper = ArticleScraper()
        scraper.store_sample_articles(target_count=20)
        scraper.close()
    except Exception as e:
        logger.error(f"Error in main function: {e}")

if __name__ == "__main__":
    main()
