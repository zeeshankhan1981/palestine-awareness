#!/bin/bash

# Script to completely rebuild the Nginx configuration
# This will ensure each domain has its own configuration and there are no conflicts

echo "Rebuilding Nginx configuration..."

# Connect to the server
ssh baremetal << 'EOF'
  # Create a backup of the current configuration
  sudo mkdir -p /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)
  sudo cp -r /etc/nginx/sites-available /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/
  sudo cp -r /etc/nginx/sites-enabled /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/
  
  # Remove all existing configurations from sites-enabled
  sudo rm -f /etc/nginx/sites-enabled/*
  
  # Create a new configuration for voiceforpalestine.xyz
  sudo tee /etc/nginx/sites-available/voiceforpalestine.xyz.conf > /dev/null << 'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name voiceforpalestine.xyz www.voiceforpalestine.xyz;
    
    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name voiceforpalestine.xyz www.voiceforpalestine.xyz;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/voiceforpalestine.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/voiceforpalestine.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Root directory for the frontend
    root /var/www/voiceforpalestine.xyz/frontend;
    index index.html;

    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/voiceforpalestine.xyz-access.log;
    error_log /var/log/nginx/voiceforpalestine.xyz-error.log;
}
NGINX_CONF

  # Enable the voiceforpalestine.xyz configuration
  sudo ln -sf /etc/nginx/sites-available/voiceforpalestine.xyz.conf /etc/nginx/sites-enabled/
  
  # Enable the frametheglobenews.xyz configuration
  sudo ln -sf /etc/nginx/sites-available/frametheglobenews.xyz.conf /etc/nginx/sites-enabled/
  
  # Enable the pmimrankhan.xyz configuration
  sudo ln -sf /etc/nginx/sites-available/pmimrankhan.xyz /etc/nginx/sites-enabled/
  
  # Test the configuration
  sudo nginx -t
  
  # Restart Nginx to apply changes (reload might not be enough)
  sudo systemctl restart nginx
  
  # Check the status of Nginx
  sudo systemctl status nginx
EOF

echo "Nginx configuration has been rebuilt!"
