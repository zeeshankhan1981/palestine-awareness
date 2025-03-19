#!/bin/bash
# Script to check the status of the Voice for Palestine deployment

# Configuration
SSH_HOST="baremetal"
DOMAIN="voiceforpalestine.xyz"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking deployment status for $DOMAIN...${NC}"

# Check if server is reachable
ssh -q -o BatchMode=yes -o ConnectTimeout=5 $SSH_HOST "echo 2>&1" && SERVER_REACHABLE=true || SERVER_REACHABLE=false

if [ "$SERVER_REACHABLE" = false ]; then
  echo -e "${RED}Cannot connect to server. Please check your SSH configuration and server status.${NC}"
  exit 1
fi

# Check Nginx configuration
echo -e "${YELLOW}Checking Nginx configuration...${NC}"
NGINX_CONFIG=$(ssh $SSH_HOST "sudo ls -la /etc/nginx/sites-enabled/ | grep $DOMAIN")
if [ -z "$NGINX_CONFIG" ]; then
  echo -e "${RED}Nginx configuration for $DOMAIN is not enabled.${NC}"
else
  echo -e "${GREEN}Nginx configuration for $DOMAIN is enabled.${NC}"
  echo -e "${YELLOW}Nginx configuration contents:${NC}"
  ssh $SSH_HOST "sudo cat /etc/nginx/sites-enabled/$DOMAIN.conf | grep server_name"
fi

# Check SSL certificate
echo -e "${YELLOW}Checking SSL certificate...${NC}"
SSL_CERT=$(ssh $SSH_HOST "sudo ls -la /etc/letsencrypt/live/ | grep $DOMAIN")
if [ -z "$SSL_CERT" ]; then
  echo -e "${RED}SSL certificate for $DOMAIN is not installed.${NC}"
else
  echo -e "${GREEN}SSL certificate for $DOMAIN is installed.${NC}"
  echo -e "${YELLOW}Certificate details:${NC}"
  ssh $SSH_HOST "sudo certbot certificates | grep -A2 $DOMAIN"
fi

# Check backend service
echo -e "${YELLOW}Checking backend service...${NC}"
BACKEND_SERVICE=$(ssh $SSH_HOST "sudo systemctl is-active voiceforpalestine-backend.service")
if [ "$BACKEND_SERVICE" = "active" ]; then
  echo -e "${GREEN}Backend service is running.${NC}"
  echo -e "${YELLOW}Service status:${NC}"
  ssh $SSH_HOST "sudo systemctl status voiceforpalestine-backend.service --no-pager | head -n 5"
else
  echo -e "${RED}Backend service is not running. Status: $BACKEND_SERVICE${NC}"
  echo -e "${YELLOW}Last 10 lines of backend service logs:${NC}"
  ssh $SSH_HOST "sudo journalctl -u voiceforpalestine-backend.service -n 10 --no-pager"
fi

# Check crawler service
echo -e "${YELLOW}Checking crawler service...${NC}"
CRAWLER_SERVICE=$(ssh $SSH_HOST "sudo systemctl is-active voiceforpalestine-crawler.service")
if [ "$CRAWLER_SERVICE" = "active" ]; then
  echo -e "${GREEN}Crawler service is running.${NC}"
  echo -e "${YELLOW}Service status:${NC}"
  ssh $SSH_HOST "sudo systemctl status voiceforpalestine-crawler.service --no-pager | head -n 5"
else
  echo -e "${RED}Crawler service is not running. Status: $CRAWLER_SERVICE${NC}"
  echo -e "${YELLOW}Last 10 lines of crawler service logs:${NC}"
  ssh $SSH_HOST "sudo journalctl -u voiceforpalestine-crawler.service -n 10 --no-pager"
fi

# Check frontend files
echo -e "${YELLOW}Checking frontend files...${NC}"
FRONTEND_FILES=$(ssh $SSH_HOST "ls -la /var/www/$DOMAIN/frontend/ | grep index.html")
if [ -z "$FRONTEND_FILES" ]; then
  echo -e "${RED}Frontend files are not deployed.${NC}"
else
  echo -e "${GREEN}Frontend files are deployed.${NC}"
  echo -e "${YELLOW}Directory listing:${NC}"
  ssh $SSH_HOST "ls -la /var/www/$DOMAIN/frontend/ | head -n 10"
fi

# Check backend files
echo -e "${YELLOW}Checking backend files...${NC}"
BACKEND_FILES=$(ssh $SSH_HOST "ls -la /var/www/$DOMAIN/backend/ | grep server.js")
if [ -z "$BACKEND_FILES" ]; then
  echo -e "${RED}Backend files are not deployed.${NC}"
else
  echo -e "${GREEN}Backend files are deployed.${NC}"
  echo -e "${YELLOW}Directory listing:${NC}"
  ssh $SSH_HOST "ls -la /var/www/$DOMAIN/backend/ | head -n 10"
fi

# Check crawler files
echo -e "${YELLOW}Checking crawler files...${NC}"
CRAWLER_FILES=$(ssh $SSH_HOST "ls -la /var/www/$DOMAIN/crawler/ | grep crawler.py")
if [ -z "$CRAWLER_FILES" ]; then
  echo -e "${RED}Crawler files are not deployed.${NC}"
else
  echo -e "${GREEN}Crawler files are deployed.${NC}"
  echo -e "${YELLOW}Directory listing:${NC}"
  ssh $SSH_HOST "ls -la /var/www/$DOMAIN/crawler/ | head -n 10"
fi

# Check server resources
echo -e "${YELLOW}Checking server resources...${NC}"
echo -e "${YELLOW}Disk usage:${NC}"
ssh $SSH_HOST "df -h | grep -E '(Filesystem|/$)'"
echo -e "${YELLOW}Memory usage:${NC}"
ssh $SSH_HOST "free -h | head -n 2"
echo -e "${YELLOW}CPU load:${NC}"
ssh $SSH_HOST "uptime"

# Check if website is accessible
echo -e "${YELLOW}Checking if website is accessible...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "Failed")
if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "${GREEN}Website is accessible (HTTP 200).${NC}"
elif [ "$HTTP_STATUS" = "Failed" ]; then
  echo -e "${YELLOW}Could not connect to website. This is expected if DNS records are not yet updated.${NC}"
else
  echo -e "${RED}Website returned unexpected HTTP Status: $HTTP_STATUS${NC}"
fi

echo -e "${YELLOW}Deployment status check completed.${NC}"
echo -e "${YELLOW}Note: If the website is not accessible, make sure DNS records for $DOMAIN point to 65.109.156.106${NC}"
