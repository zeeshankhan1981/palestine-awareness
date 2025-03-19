# Palestine Decentralized News & Awareness Hub

A decentralized news and awareness platform for Palestine that stores article metadata and hashes on the Polygon blockchain for verification and authenticity.

## Project Overview

This platform:
- Pulls articles from trusted news sources using a web crawler
- Allows user submissions of additional articles
- Stores metadata and content hashes on Polygon PoS for tamper-proof verification
- Provides a user-friendly interface to browse, submit, and verify articles

## System Architecture

- **Frontend**: React application with custom CSS
- **Backend API**: Express.js server for managing submissions and blockchain interactions
- **Web Crawler**: Python-based crawler to fetch articles from trusted sources
- **Blockchain Integration**: Smart contract on Polygon for storing article hashes
- **Database**: PostgreSQL for storing article metadata
- **Hosting**: Self-hosted on baremetal server with Nginx

## Components

### 1. Web Crawler
- Python-based crawler that fetches articles from trusted sources
- Extracts metadata and generates content hashes
- Stores data in PostgreSQL and submits hashes to blockchain

### 2. Backend API
- Express.js server for handling user submissions and verification
- Interacts with PostgreSQL database and Polygon blockchain

### 3. Smart Contract
- Solidity contract deployed on Polygon PoS
- Stores article hashes and metadata for verification

### 4. Frontend
- React application with custom CSS (Tailwind-inspired design)
- Interfaces for browsing articles, submitting new ones, and verifying content

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- PostgreSQL
- MetaMask or similar Web3 wallet

### Installation
1. Clone this repository
2. Set up each component following the instructions in their respective directories
3. Configure environment variables
4. Start the development servers

## License
This project is open source and available under the MIT License.
