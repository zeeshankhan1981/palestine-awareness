#!/bin/bash
# Test deployment script for Palestine News Hub
# This script deploys the application in testing mode without affecting DNS

set -e

# Load configuration
CONFIG_FILE="$(dirname "$0")/config.env"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Configuration file not found: $CONFIG_FILE"
  exit 1
fi

source "$CONFIG_FILE"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting TEST deployment of Palestine News Hub to $DOMAIN...${NC}"
echo -e "${YELLOW}This is a TEST deployment that will NOT update DNS records.${NC}"
echo -e "${YELLOW}This deployment will not affect your existing websites.${NC}"

# Confirm deployment
read -p "Are you sure you want to proceed with TEST deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Deployment cancelled.${NC}"
  exit 1
fi

# Create a temporary test subdomain for testing
TEST_SUBDOMAIN="test.$DOMAIN"
TEST_DIR="$REMOTE_DIR/test"

# 1. Build the React frontend
echo -e "${GREEN}Building React frontend for testing...${NC}"
cd ../frontend
npm install
REACT_APP_TESTING_MODE=true REACT_APP_API_URL="https://$TEST_SUBDOMAIN/api" npm run build

# 2. Prepare backend for deployment
echo -e "${GREEN}Preparing backend...${NC}"
cd ../backend
npm install

# 3. Create deployment package
echo -e "${GREEN}Creating deployment package...${NC}"
cd ..
DEPLOY_DIR="deploy_test_$(date +%Y%m%d_%H%M%S)"
mkdir -p $DEPLOY_DIR

# Copy frontend build
cp -r frontend/build $DEPLOY_DIR/frontend

# Copy backend files
mkdir -p $DEPLOY_DIR/backend
cp -r backend/{package.json,package-lock.json,server.js,routes,models,utils} $DEPLOY_DIR/backend

# Copy crawler files
mkdir -p $DEPLOY_DIR/crawler
cp -r crawler/{requirements.txt,crawler.py,article_scraper.py,contract_abi.json,temp_env.txt} $DEPLOY_DIR/crawler

# Create test Nginx config
mkdir -p $DEPLOY_DIR/nginx
cat > $DEPLOY_DIR/nginx/$TEST_SUBDOMAIN.conf << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $TEST_SUBDOMAIN;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $TEST_SUBDOMAIN;

    # SSL configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;

    # HSTS (optional)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Root directory for the frontend
    root $TEST_DIR/frontend;
    index index.html;

    # Frontend static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/$TEST_SUBDOMAIN-access.log;
    error_log /var/log/nginx/$TEST_SUBDOMAIN-error.log;
}
EOF

# Create test systemd service files
mkdir -p $DEPLOY_DIR/systemd
cat > $DEPLOY_DIR/systemd/voiceforpalestine-test-backend.service << EOF
[Unit]
Description=Voice for Palestine Test Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$TEST_DIR/backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3002

[Install]
WantedBy=multi-user.target
EOF

cat > $DEPLOY_DIR/systemd/voiceforpalestine-test-crawler.service << EOF
[Unit]
Description=Voice for Palestine Test Crawler Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$TEST_DIR/crawler
ExecStart=/bin/bash -c 'source venv/bin/activate && python crawler.py'
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Create .env files from examples if they don't exist
if [ ! -f backend/.env ]; then
  echo -e "${YELLOW}Backend .env file not found. Creating from example...${NC}"
  cp backend/.env.example $DEPLOY_DIR/backend/.env
  # Update port in .env
  echo "PORT=3002" >> $DEPLOY_DIR/backend/.env
fi

if [ ! -f crawler/.env ]; then
  echo -e "${YELLOW}Crawler .env file not found. Creating from example...${NC}"
  cp crawler/temp_env.txt $DEPLOY_DIR/crawler/.env
fi

# 4. Deploy to server
echo -e "${GREEN}Deploying to server...${NC}"
echo -e "${YELLOW}This will require SSH access to your server.${NC}"

# Check if server is reachable
ssh -q -o BatchMode=yes -o ConnectTimeout=5 $SERVER_HOSTNAME "echo 2>&1" && SERVER_REACHABLE=true || SERVER_REACHABLE=false

if [ "$SERVER_REACHABLE" = false ]; then
  echo -e "${RED}Cannot connect to server. Please check your SSH configuration and server status.${NC}"
  exit 1
fi

# Create remote directories
ssh $SERVER_HOSTNAME "sudo mkdir -p $TEST_DIR/{frontend,backend,crawler}"

# Copy files to server
echo -e "${GREEN}Copying files to server...${NC}"
scp -r $DEPLOY_DIR/frontend/* $SERVER_HOSTNAME:$TEST_DIR/frontend/
scp -r $DEPLOY_DIR/backend/* $SERVER_HOSTNAME:$TEST_DIR/backend/
scp -r $DEPLOY_DIR/crawler/* $SERVER_HOSTNAME:$TEST_DIR/crawler/
scp $DEPLOY_DIR/nginx/$TEST_SUBDOMAIN.conf $SERVER_HOSTNAME:/tmp/$TEST_SUBDOMAIN.conf
scp $DEPLOY_DIR/systemd/* $SERVER_HOSTNAME:/tmp/

# 5. Configure Nginx
echo -e "${GREEN}Configuring Nginx...${NC}"
ssh $SERVER_HOSTNAME "sudo mv /tmp/$TEST_SUBDOMAIN.conf $NGINX_CONF_DIR/ && \
                      sudo ln -sf $NGINX_CONF_DIR/$TEST_SUBDOMAIN.conf $NGINX_ENABLED_DIR/ && \
                      sudo nginx -t && \
                      sudo systemctl reload nginx"

# 6. Set up SSL with Let's Encrypt (if not already done)
echo -e "${GREEN}Checking SSL certificate...${NC}"
ssh $SERVER_HOSTNAME "if [ ! -d /etc/letsencrypt/live/$DOMAIN ]; then \
                      sudo certbot --nginx -d $TEST_SUBDOMAIN; \
                    else \
                      echo 'Using existing SSL certificate.'; \
                    fi"

# 7. Install dependencies and set up systemd services
echo -e "${GREEN}Setting up systemd services...${NC}"
ssh $SERVER_HOSTNAME "sudo mv /tmp/voiceforpalestine-test-*.service /etc/systemd/system/ && \
                      sudo systemctl daemon-reload"

# 8. Install backend dependencies and start service
echo -e "${GREEN}Setting up backend service...${NC}"
ssh $SERVER_HOSTNAME "cd $TEST_DIR/backend && \
                      npm install && \
                      sudo systemctl enable voiceforpalestine-test-backend.service && \
                      sudo systemctl restart voiceforpalestine-test-backend.service"

# 9. Set up Python crawler
echo -e "${GREEN}Setting up Python crawler...${NC}"
ssh $SERVER_HOSTNAME "cd $TEST_DIR/crawler && \
                      python3 -m venv venv && \
                      source venv/bin/activate && \
                      pip install -r requirements.txt && \
                      sudo systemctl enable voiceforpalestine-test-crawler.service && \
                      sudo systemctl restart voiceforpalestine-test-crawler.service"

# 10. Set proper permissions
echo -e "${GREEN}Setting proper permissions...${NC}"
ssh $SERVER_HOSTNAME "sudo chown -R www-data:www-data $TEST_DIR"

# 11. Clean up local deployment directory
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf $DEPLOY_DIR

echo -e "${GREEN}Test deployment completed successfully!${NC}"
echo -e "Your test application will be available at https://$TEST_SUBDOMAIN once you update your hosts file"
echo -e "${YELLOW}IMPORTANT: This is a TEST deployment. No DNS records have been modified.${NC}"
echo -e "${YELLOW}To test locally, add the following to your /etc/hosts file:${NC}"
echo -e "${YELLOW}$SERVER_IP $TEST_SUBDOMAIN${NC}"
echo -e "${YELLOW}Your existing websites are unaffected by this deployment.${NC}"
echo -e "${YELLOW}When you're ready for production deployment, run the deploy.sh script and update DNS records.${NC}"
