# Palestine News Hub Documentation

## Project Overview

The Palestine Decentralized News & Awareness Hub is a platform that stores article metadata and hashes on the Polygon blockchain for verification and authenticity. This document provides comprehensive information about the project's architecture, components, and development process.

## System Architecture

- **Frontend**: React application with custom CSS (Tailwind-inspired design)
- **Backend API**: Express.js server for managing submissions and blockchain interactions
- **Web Crawler**: Python-based crawler to fetch articles from trusted sources
- **Blockchain Integration**: Smart contract on Polygon for storing article hashes
- **Database**: PostgreSQL for storing article metadata
- **Hosting**: Self-hosted on baremetal server with Nginx

## Frontend Components

### 1. Pages
- **HomePage**: Landing page with introduction and featured articles
- **ArticlesPage**: List of all articles with pagination
- **ArticleDetailPage**: Detailed view of a specific article with verification info
- **SubmitArticlePage**: Form for submitting new articles
- **VerifyArticlePage**: Tool for verifying article authenticity
- **AboutPage**: Information about the platform and its mission
- **NotFoundPage**: 404 error page

### 2. UI Components
- **Navbar**: Navigation menu with links to main sections
- **Footer**: Contact information and additional links
- **ArticleCard**: Card displaying article preview
- **VerificationBadge**: Visual indicator of verification status

### 3. Styling
- Custom CSS with Tailwind-inspired utility classes
- Palestinian flag color scheme (green, red, black, white)
- Watermelon pattern as a cultural symbol

## Backend Components

### 1. API Endpoints
- `/api/articles`: CRUD operations for articles
- `/api/verify`: Verification endpoints
- `/api/submit`: Article submission endpoint

### 2. Blockchain Integration
- Smart contract for storing article hashes
- Verification logic to check content authenticity

### 3. Database Schema
- Articles table with metadata and blockchain references
- Sources table for trusted news sources
- Users table for contributors

## Development Process

### 1. CSS Migration
We migrated from Tailwind CSS to custom CSS to simplify deployment:
- Removed Tailwind dependencies (tailwindcss, postcss, autoprefixer)
- Removed Tailwind configuration files
- Converted all Tailwind directives to standard CSS
- Maintained the same visual design with custom utility classes

### 2. React Icons Integration
- Used React Icons for consistent iconography
- Downgraded from v5.5.0 to v4.12.0 for compatibility

### 3. Responsive Design
- Mobile-first approach
- Breakpoints for different screen sizes
- Optimized navigation for mobile devices

## Deployment Strategy

### 1. Server Setup
- Nginx as reverse proxy
- PM2 for process management
- SSL certificates for secure connections

### 2. CI/CD Pipeline
- Automated testing before deployment
- Staging environment for pre-production testing
- Production deployment with rollback capability

### 3. Monitoring
- Server health monitoring
- Application performance metrics
- Error logging and alerting

## Security Considerations

### 1. Data Protection
- Content verification through blockchain
- Protection against tampering and misinformation

### 2. User Privacy
- Minimal data collection
- Transparent privacy policy

### 3. API Security
- Rate limiting
- Input validation
- Authentication for sensitive operations

## Future Enhancements

### 1. Multilingual Support
- Arabic and English interfaces
- Content translation capabilities

### 2. Enhanced Verification
- Multi-source verification
- AI-assisted fact-checking

### 3. Community Features
- User comments and discussions
- Contributor profiles

## Maintenance Guidelines

### 1. Code Updates
- Regular dependency updates
- Security patches
- Performance optimizations

### 2. Content Moderation
- Guidelines for article submission
- Review process for new sources

### 3. Backup Strategy
- Regular database backups
- Blockchain transaction records
- Configuration backups

## Troubleshooting

### 1. Common Issues
- Blockchain connectivity problems
- Database connection errors
- API rate limiting

### 2. Debugging Tools
- Server logs
- Frontend console logs
- Blockchain transaction explorer

## Contact Information

For questions or contributions, please contact the project maintainers:
- Email: support@palestinenewshub.org
- GitHub: github.com/palestine-awareness
