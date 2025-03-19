#!/bin/bash
# Deployment script for Palestine News Hub on voiceforpalestine.xyz
# This script deploys the application in production mode

set -e

# Configuration
SSH_HOST="baremetal"
DOMAIN="voiceforpalestine.xyz"
REMOTE_DIR="/var/www/$DOMAIN"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Palestine News Hub to $DOMAIN...${NC}"
echo -e "${YELLOW}This deployment will not affect your existing websites (pmimrankhan.xyz and frametheglobenews.xyz)${NC}"

# Confirm deployment
read -p "Are you sure you want to proceed with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 1
fi

# 1. Build the React frontend
echo -e "${GREEN}Building React frontend...${NC}"
cd /Users/zeeshankhan/palestine-awareness/palestine-news-hub/frontend
npm install
REACT_APP_TESTING_MODE=false npm run build

# 2. Prepare backend for deployment
echo -e "${GREEN}Preparing backend...${NC}"
cd /Users/zeeshankhan/palestine-awareness/palestine-news-hub/backend
npm install

# 3. Create deployment package
echo -e "${GREEN}Creating deployment package...${NC}"
cd /Users/zeeshankhan/palestine-awareness/palestine-news-hub
DEPLOY_DIR="deploy_$(date +%Y%m%d_%H%M%S)"
mkdir -p $DEPLOY_DIR

# Copy frontend build
cp -r frontend/build/* $DEPLOY_DIR/frontend/

# Copy backend files
mkdir -p $DEPLOY_DIR/backend
cp -r backend/{package.json,package-lock.json,server.js,routes,models,utils} $DEPLOY_DIR/backend

# Copy crawler files
mkdir -p $DEPLOY_DIR/crawler
cp -r crawler/{requirements.txt,crawler.py,article_scraper.py,contract_abi.json,temp_env.txt} $DEPLOY_DIR/crawler

# Copy Nginx config
mkdir -p $DEPLOY_DIR/nginx
cp deployment/nginx/$DOMAIN.conf $DEPLOY_DIR/nginx/

# Copy systemd service files
mkdir -p $DEPLOY_DIR/systemd
cp deployment/systemd/voiceforpalestine-*.service $DEPLOY_DIR/systemd/

# Create .env files from examples if they don't exist
if [ ! -f backend/.env ]; then
  echo -e "${YELLOW}Backend .env file not found. Creating from example...${NC}"
  cp backend/.env.example $DEPLOY_DIR/backend/.env
else
  cp backend/.env $DEPLOY_DIR/backend/.env
fi

if [ ! -f crawler/.env ]; then
  echo -e "${YELLOW}Crawler .env file not found. Creating from example...${NC}"
  cp crawler/temp_env.txt $DEPLOY_DIR/crawler/.env
else
  cp crawler/.env $DEPLOY_DIR/crawler/.env
fi

# 4. Deploy to server
echo -e "${GREEN}Deploying to server...${NC}"
echo -e "${YELLOW}This will require SSH access to your server.${NC}"

# Check if server is reachable
ssh -q -o BatchMode=yes -o ConnectTimeout=5 $SSH_HOST "echo 2>&1" && SERVER_REACHABLE=true || SERVER_REACHABLE=false

if [ "$SERVER_REACHABLE" = false ]; then
  echo -e "${RED}Cannot connect to server. Please check your SSH configuration and server status.${NC}"
  exit 1
fi

# Create remote directories
ssh $SSH_HOST "sudo mkdir -p $REMOTE_DIR/{frontend,backend,crawler}"

# Copy files to server
echo -e "${GREEN}Copying files to server...${NC}"
scp -r $DEPLOY_DIR/frontend/* $SSH_HOST:$REMOTE_DIR/frontend/
scp -r $DEPLOY_DIR/backend/* $SSH_HOST:$REMOTE_DIR/backend/
scp -r $DEPLOY_DIR/crawler/* $SSH_HOST:$REMOTE_DIR/crawler/
scp $DEPLOY_DIR/nginx/$DOMAIN.conf $SSH_HOST:/tmp/$DOMAIN.conf
scp $DEPLOY_DIR/systemd/* $SSH_HOST:/tmp/

# 5. Configure Nginx
echo -e "${GREEN}Configuring Nginx...${NC}"
ssh $SSH_HOST "sudo mv /tmp/$DOMAIN.conf $NGINX_CONF_DIR/ && \
                            sudo ln -sf $NGINX_CONF_DIR/$DOMAIN.conf $NGINX_ENABLED_DIR/ && \
                            sudo nginx -t && \
                            sudo systemctl reload nginx"

# 6. SSL setup skipped for initial deployment
echo -e "${YELLOW}Skipping SSL setup for initial deployment...${NC}"
echo -e "${YELLOW}You can set up SSL later using: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"

# 7. Install dependencies and set up systemd services
echo -e "${GREEN}Setting up systemd services...${NC}"
ssh $SSH_HOST "sudo mv /tmp/voiceforpalestine-*.service /etc/systemd/system/ && \
                            sudo systemctl daemon-reload"

# 8. Install backend dependencies and start service
echo -e "${GREEN}Setting up backend service...${NC}"
ssh $SSH_HOST "cd $REMOTE_DIR/backend && \
                            npm install && \
                            sudo systemctl enable voiceforpalestine-backend.service && \
                            sudo systemctl restart voiceforpalestine-backend.service"

# 9. Set up Python crawler
echo -e "${GREEN}Setting up Python crawler...${NC}"
ssh $SSH_HOST "cd $REMOTE_DIR/crawler && \
                            python3 -m venv venv && \
                            source venv/bin/activate && \
                            pip install -r requirements.txt && \
                            pip install 'lxml[html_clean]' && \
                            sudo systemctl enable voiceforpalestine-crawler.service && \
                            sudo systemctl restart voiceforpalestine-crawler.service"

# 10. Set proper permissions
echo -e "${GREEN}Setting proper permissions...${NC}"
ssh $SSH_HOST "sudo chown -R www-data:www-data $REMOTE_DIR"

# 11. Clean up local deployment directory
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf $DEPLOY_DIR

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "Your application is now available at http://$DOMAIN"
echo -e "${YELLOW}Note: Make sure to update your DNS settings to point $DOMAIN to your server IP (65.109.156.106).${NC}"
echo -e "${YELLOW}Your existing websites (pmimrankhan.xyz and frametheglobenews.xyz) are unaffected by this deployment.${NC}"
echo -e "${YELLOW}To set up SSL after initial deployment, run: ssh $SSH_HOST \"sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN\"${NC}"
