#!/bin/bash

# Script to fix Nginx configuration issues
# This will properly separate the domains and ensure they don't conflict

echo "Fixing Nginx configuration issues..."

# Connect to the server
ssh baremetal << 'EOF'
  # Create a backup of the current configuration
  sudo mkdir -p /etc/nginx/backup
  sudo cp -r /etc/nginx/sites-available /etc/nginx/backup/
  sudo cp -r /etc/nginx/sites-enabled /etc/nginx/backup/
  
  # Remove the combined domains configuration
  sudo rm -f /etc/nginx/sites-enabled/combined-domains.conf
  
  # Make sure each domain has its own configuration
  sudo ln -sf /etc/nginx/sites-available/voiceforpalestine.xyz.conf /etc/nginx/sites-enabled/
  sudo ln -sf /etc/nginx/sites-available/frametheglobenews.xyz.conf /etc/nginx/sites-enabled/
  sudo ln -sf /etc/nginx/sites-available/pmimrankhan.xyz /etc/nginx/sites-enabled/
  
  # Test the configuration
  sudo nginx -t
  
  # Reload Nginx to apply changes
  sudo systemctl reload nginx
  
  # Check which services are running on port 8081
  echo "Services running on port 8081:"
  sudo lsof -i :8081
  
  # Check which Python processes are running
  echo "Python processes:"
  ps aux | grep python | grep -v grep
EOF

echo "Nginx configuration has been fixed!"
