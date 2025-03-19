#!/bin/bash

# Script to fix the Nginx configuration paths
# This will update the path to the frontend files

echo "Fixing Nginx configuration paths..."

# Connect to the server
ssh baremetal << 'EOF'
  # Update the Nginx configuration for voiceforpalestine.xyz
  sudo sed -i 's|root /var/www/voiceforpalestine.xyz/frontend/build;|root /var/www/voiceforpalestine.xyz/frontend;|g' /etc/nginx/sites-available/voiceforpalestine.xyz.conf
  
  # Test the configuration
  sudo nginx -t
  
  # Reload Nginx to apply changes
  sudo systemctl reload nginx
  
  # Check the updated configuration
  echo "Updated Nginx configuration:"
  cat /etc/nginx/sites-available/voiceforpalestine.xyz.conf | grep root
EOF

echo "Nginx configuration paths have been fixed!"
