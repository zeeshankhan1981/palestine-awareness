#!/bin/bash
# Deployment script for Palestine News Hub on voiceforpalestine.xyz

set -e

# Configuration
SERVER_USER="your_server_username"
SERVER_IP="your_server_ip"
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

# 1. Build the React frontend
echo -e "${GREEN}Building React frontend...${NC}"
cd ../frontend
npm install
npm run build

# 2. Prepare backend for deployment
echo -e "${GREEN}Preparing backend...${NC}"
cd ../backend
npm install

# 3. Create deployment package
echo -e "${GREEN}Creating deployment package...${NC}"
cd ..
DEPLOY_DIR="deploy_$(date +%Y%m%d_%H%M%S)"
mkdir -p $DEPLOY_DIR

# Copy frontend build
cp -r frontend/build $DEPLOY_DIR/frontend

# Copy backend files
mkdir -p $DEPLOY_DIR/backend
cp -r backend/{package.json,package-lock.json,server.js} $DEPLOY_DIR/backend

# Copy crawler files
mkdir -p $DEPLOY_DIR/crawler
cp -r crawler/{requirements.txt,crawler.py,contract_abi.json,.env.example} $DEPLOY_DIR/crawler

# Copy Nginx config
mkdir -p $DEPLOY_DIR/nginx
cp deployment/nginx/$DOMAIN.conf $DEPLOY_DIR/nginx/

# Create .env files from examples if they don't exist
if [ ! -f backend/.env ]; then
  echo -e "${YELLOW}Backend .env file not found. Creating from example...${NC}"
  cp backend/.env.example $DEPLOY_DIR/backend/.env
fi

if [ ! -f crawler/.env ]; then
  echo -e "${YELLOW}Crawler .env file not found. Creating from example...${NC}"
  cp crawler/.env.example $DEPLOY_DIR/crawler/.env
fi

# 4. Deploy to server
echo -e "${GREEN}Deploying to server...${NC}"
echo -e "${YELLOW}This will require SSH access to your server.${NC}"

# Create remote directories
ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR/{frontend,backend,crawler}"

# Copy files to server
echo -e "${GREEN}Copying files to server...${NC}"
scp -r $DEPLOY_DIR/frontend/* $SERVER_USER@$SERVER_IP:$REMOTE_DIR/frontend/
scp -r $DEPLOY_DIR/backend/* $SERVER_USER@$SERVER_IP:$REMOTE_DIR/backend/
scp -r $DEPLOY_DIR/crawler/* $SERVER_USER@$SERVER_IP:$REMOTE_DIR/crawler/
scp $DEPLOY_DIR/nginx/$DOMAIN.conf $SERVER_USER@$SERVER_IP:/tmp/$DOMAIN.conf

# 5. Configure Nginx
echo -e "${GREEN}Configuring Nginx...${NC}"
ssh $SERVER_USER@$SERVER_IP "sudo mv /tmp/$DOMAIN.conf $NGINX_CONF_DIR/ && \
                            sudo ln -sf $NGINX_CONF_DIR/$DOMAIN.conf $NGINX_ENABLED_DIR/ && \
                            sudo nginx -t && \
                            sudo systemctl reload nginx"

# 6. Set up SSL with Let's Encrypt (if not already done)
echo -e "${GREEN}Checking SSL certificate...${NC}"
ssh $SERVER_USER@$SERVER_IP "if [ ! -d /etc/letsencrypt/live/$DOMAIN ]; then \
                              sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN; \
                            else \
                              echo 'SSL certificate already exists.'; \
                            fi"

# 7. Install dependencies and start services
echo -e "${GREEN}Setting up backend services...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR/backend && \
                            npm install && \
                            sudo npm install -g pm2 && \
                            pm2 delete $DOMAIN-backend || true && \
                            pm2 start server.js --name $DOMAIN-backend"

echo -e "${GREEN}Setting up Python crawler...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR/crawler && \
                            python3 -m venv venv && \
                            source venv/bin/activate && \
                            pip install -r requirements.txt && \
                            pm2 delete $DOMAIN-crawler || true && \
                            pm2 start crawler.py --name $DOMAIN-crawler --interpreter=./venv/bin/python3"

# 8. Save PM2 configuration
ssh $SERVER_USER@$SERVER_IP "pm2 save"

# 9. Clean up local deployment directory
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf $DEPLOY_DIR

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "Your application is now available at https://$DOMAIN"
echo -e "${YELLOW}Note: Make sure to update your DNS settings to point $DOMAIN to your server IP.${NC}"
