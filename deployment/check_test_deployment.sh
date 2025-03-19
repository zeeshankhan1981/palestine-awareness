#!/bin/bash
# Script to check the status of the Voice for Palestine test deployment

# Load configuration
CONFIG_FILE="$(dirname "$0")/config.env"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Configuration file not found: $CONFIG_FILE"
  exit 1
fi

source "$CONFIG_FILE"

# Test subdomain
TEST_SUBDOMAIN="test.$DOMAIN"
TEST_DIR="$REMOTE_DIR/test"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking TEST deployment status for $TEST_SUBDOMAIN...${NC}"

# Check if server is reachable
ssh -q -o BatchMode=yes -o ConnectTimeout=5 $SERVER_HOSTNAME "echo 2>&1" && SERVER_REACHABLE=true || SERVER_REACHABLE=false

if [ "$SERVER_REACHABLE" = false ]; then
  echo -e "${RED}Cannot connect to server. Please check your SSH configuration and server status.${NC}"
  exit 1
fi

# Check Nginx configuration
echo -e "${YELLOW}Checking Nginx configuration...${NC}"
NGINX_CONFIG=$(ssh $SERVER_HOSTNAME "sudo ls -la $NGINX_ENABLED_DIR/ | grep $TEST_SUBDOMAIN")
if [ -z "$NGINX_CONFIG" ]; then
  echo -e "${RED}Nginx configuration for $TEST_SUBDOMAIN is not enabled.${NC}"
else
  echo -e "${GREEN}Nginx configuration for $TEST_SUBDOMAIN is enabled.${NC}"
  echo -e "${YELLOW}Nginx configuration contents:${NC}"
  ssh $SERVER_HOSTNAME "sudo cat $NGINX_ENABLED_DIR/$TEST_SUBDOMAIN.conf | grep server_name"
fi

# Check SSL certificate
echo -e "${YELLOW}Checking SSL certificate...${NC}"
SSL_CERT=$(ssh $SERVER_HOSTNAME "sudo ls -la /etc/letsencrypt/live/ | grep $DOMAIN")
if [ -z "$SSL_CERT" ]; then
  echo -e "${RED}SSL certificate is not installed.${NC}"
else
  echo -e "${GREEN}SSL certificate is installed.${NC}"
  echo -e "${YELLOW}Certificate details:${NC}"
  ssh $SERVER_HOSTNAME "sudo certbot certificates | grep -A2 $DOMAIN"
fi

# Check backend service
echo -e "${YELLOW}Checking test backend service...${NC}"
BACKEND_SERVICE=$(ssh $SERVER_HOSTNAME "sudo systemctl is-active voiceforpalestine-test-backend.service")
if [ "$BACKEND_SERVICE" = "active" ]; then
  echo -e "${GREEN}Test backend service is running.${NC}"
  echo -e "${YELLOW}Service status:${NC}"
  ssh $SERVER_HOSTNAME "sudo systemctl status voiceforpalestine-test-backend.service --no-pager | head -n 5"
else
  echo -e "${RED}Test backend service is not running. Status: $BACKEND_SERVICE${NC}"
  echo -e "${YELLOW}Last 10 lines of backend service logs:${NC}"
  ssh $SERVER_HOSTNAME "sudo journalctl -u voiceforpalestine-test-backend.service -n 10 --no-pager"
fi

# Check crawler service
echo -e "${YELLOW}Checking test crawler service...${NC}"
CRAWLER_SERVICE=$(ssh $SERVER_HOSTNAME "sudo systemctl is-active voiceforpalestine-test-crawler.service")
if [ "$CRAWLER_SERVICE" = "active" ]; then
  echo -e "${GREEN}Test crawler service is running.${NC}"
  echo -e "${YELLOW}Service status:${NC}"
  ssh $SERVER_HOSTNAME "sudo systemctl status voiceforpalestine-test-crawler.service --no-pager | head -n 5"
else
  echo -e "${RED}Test crawler service is not running. Status: $CRAWLER_SERVICE${NC}"
  echo -e "${YELLOW}Last 10 lines of crawler service logs:${NC}"
  ssh $SERVER_HOSTNAME "sudo journalctl -u voiceforpalestine-test-crawler.service -n 10 --no-pager"
fi

# Check frontend files
echo -e "${YELLOW}Checking frontend files...${NC}"
FRONTEND_FILES=$(ssh $SERVER_HOSTNAME "ls -la $TEST_DIR/frontend/ | grep index.html")
if [ -z "$FRONTEND_FILES" ]; then
  echo -e "${RED}Frontend files are not deployed.${NC}"
else
  echo -e "${GREEN}Frontend files are deployed.${NC}"
  echo -e "${YELLOW}Directory listing:${NC}"
  ssh $SERVER_HOSTNAME "ls -la $TEST_DIR/frontend/ | head -n 10"
fi

# Check backend files
echo -e "${YELLOW}Checking backend files...${NC}"
BACKEND_FILES=$(ssh $SERVER_HOSTNAME "ls -la $TEST_DIR/backend/ | grep server.js")
if [ -z "$BACKEND_FILES" ]; then
  echo -e "${RED}Backend files are not deployed.${NC}"
else
  echo -e "${GREEN}Backend files are deployed.${NC}"
  echo -e "${YELLOW}Directory listing:${NC}"
  ssh $SERVER_HOSTNAME "ls -la $TEST_DIR/backend/ | head -n 10"
fi

# Check crawler files
echo -e "${YELLOW}Checking crawler files...${NC}"
CRAWLER_FILES=$(ssh $SERVER_HOSTNAME "ls -la $TEST_DIR/crawler/ | grep crawler.py")
if [ -z "$CRAWLER_FILES" ]; then
  echo -e "${RED}Crawler files are not deployed.${NC}"
else
  echo -e "${GREEN}Crawler files are deployed.${NC}"
  echo -e "${YELLOW}Directory listing:${NC}"
  ssh $SERVER_HOSTNAME "ls -la $TEST_DIR/crawler/ | head -n 10"
fi

# Check server resources
echo -e "${YELLOW}Checking server resources...${NC}"
echo -e "${YELLOW}Disk usage:${NC}"
ssh $SERVER_HOSTNAME "df -h | grep -E '(Filesystem|/$)'"
echo -e "${YELLOW}Memory usage:${NC}"
ssh $SERVER_HOSTNAME "free -h | head -n 2"
echo -e "${YELLOW}CPU load:${NC}"
ssh $SERVER_HOSTNAME "uptime"

echo -e "${YELLOW}Test deployment status check completed.${NC}"
echo -e "${YELLOW}To test locally, add the following to your /etc/hosts file:${NC}"
echo -e "${YELLOW}$SERVER_IP $TEST_SUBDOMAIN${NC}"
