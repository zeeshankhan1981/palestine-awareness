# Palestine News Hub - Documentation Index

This document serves as an index to all documentation files in the Palestine News Hub project.

## Core Documentation

1. **[README.md](./README.md)**
   - Project overview
   - System architecture
   - Component descriptions
   - Getting started guide
   - Prerequisites and installation instructions

2. **[DOCUMENTATION.md](./DOCUMENTATION.md)**
   - Comprehensive project documentation
   - Detailed component descriptions
   - Development process
   - Deployment strategy
   - Security considerations
   - Maintenance guidelines

3. **[CHANGELOG.md](./CHANGELOG.md)**
   - Version history
   - Feature additions
   - Changes and improvements
   - Bug fixes
   - Documentation updates

4. **[PROJECT_STATUS.md](./PROJECT_STATUS.md)**
   - Current development status
   - Completed tasks
   - In-progress work
   - Next steps
   - Testing status
   - Deployment readiness
   - Known issues

## Component-Specific Documentation

### Frontend

- **[frontend/README.md](./frontend/README.md)**
  - Frontend-specific setup
  - Available scripts
  - Component structure

### Backend

- **[backend/.env.example](./backend/.env.example)**
  - Environment variable documentation
  - Configuration options

### Deployment

- **[deployment/README.md](./deployment/README.md)**
  - Deployment instructions
  - Server configuration
  - SSL setup

- **[deployment/deploy.sh](./deployment/deploy.sh)**
  - Deployment script documentation
  - Step-by-step deployment process

- **[deployment/nginx/voiceforpalestine.xyz.conf](./deployment/nginx/voiceforpalestine.xyz.conf)**
  - Nginx configuration
  - Reverse proxy setup

- **[deployment/systemd/voiceforpalestine-backend.service](./deployment/systemd/voiceforpalestine-backend.service)**
  - Backend service configuration
  - Process management

- **[deployment/systemd/voiceforpalestine-crawler.service](./deployment/systemd/voiceforpalestine-crawler.service)**
  - Crawler service configuration
  - Scheduling and monitoring

### Database

- **[deployment/db_setup.sql](./deployment/db_setup.sql)**
  - Database schema
  - Table definitions
  - Initial data setup

### Web Crawler

- **[crawler/requirements.txt](./crawler/requirements.txt)**
  - Python dependencies
  - Version specifications

- **[crawler/.env.example](./crawler/.env.example)**
  - Crawler configuration options
  - API keys and endpoints

### Smart Contracts

- **[contracts/PalestineNewsVerifier.sol](./contracts/PalestineNewsVerifier.sol)**
  - Smart contract documentation
  - Function descriptions
  - Verification logic

## How to Use This Documentation

1. Start with **README.md** for a general overview
2. Review **PROJECT_STATUS.md** to understand the current state
3. Consult **DOCUMENTATION.md** for detailed information
4. Check **CHANGELOG.md** for recent updates
5. Refer to component-specific documentation as needed

## Contributing to Documentation

When contributing to this project, please update the relevant documentation files to reflect your changes. If adding new features or components, consider creating additional documentation as needed.

## Documentation Standards

- Use Markdown format for all documentation
- Include clear headings and subheadings
- Provide code examples where appropriate
- Update the CHANGELOG.md when making significant changes
- Keep documentation up-to-date with code changes
