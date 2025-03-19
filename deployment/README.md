# Deployment Guide for Voice for Palestine

This guide explains how to deploy the Palestine Decentralized News & Awareness Hub to your baremetal server under the domain `voiceforpalestine.xyz` without interfering with your existing websites.

## Prerequisites

- A baremetal server with Ubuntu/Debian
- Nginx installed
- PostgreSQL installed
- Node.js (v16+) installed
- Python 3.8+ installed
- Domain name `voiceforpalestine.xyz` with DNS pointing to your server

## Deployment Steps

### 1. Database Setup

1. Copy the `db_setup.sql` file to your server:
   ```
   scp db_setup.sql your_username@your_server_ip:/tmp/
   ```

2. Run the SQL script to create the database and user:
   ```
   sudo -u postgres psql -f /tmp/db_setup.sql
   ```

3. Update the password in the SQL file and in the `.env` files for both backend and crawler.

### 2. Nginx Configuration

1. Copy the Nginx configuration file to your server:
   ```
   scp nginx/voiceforpalestine.xyz.conf your_username@your_server_ip:/tmp/
   ```

2. Move the configuration file to the Nginx sites directory:
   ```
   sudo mv /tmp/voiceforpalestine.xyz.conf /etc/nginx/sites-available/
   ```

3. Create a symbolic link to enable the site:
   ```
   sudo ln -s /etc/nginx/sites-available/voiceforpalestine.xyz.conf /etc/nginx/sites-enabled/
   ```

4. Test the Nginx configuration:
   ```
   sudo nginx -t
   ```

5. If the test is successful, reload Nginx:
   ```
   sudo systemctl reload nginx
   ```

### 3. SSL Certificate

1. Install Certbot if not already installed:
   ```
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. Obtain an SSL certificate:
   ```
   sudo certbot --nginx -d voiceforpalestine.xyz -d www.voiceforpalestine.xyz
   ```

### 4. Application Deployment

#### Using the Automated Script

1. Edit the `deploy.sh` script to update the following variables:
   - `SERVER_USER`: Your server username
   - `SERVER_IP`: Your server IP address

2. Make the script executable:
   ```
   chmod +x deploy.sh
   ```

3. Run the deployment script:
   ```
   ./deploy.sh
   ```

#### Manual Deployment

If you prefer to deploy manually:

1. Build the frontend:
   ```
   cd ../frontend
   npm install
   npm run build
   ```

2. Create the application directory on your server:
   ```
   ssh your_username@your_server_ip "sudo mkdir -p /var/www/voiceforpalestine.xyz/{frontend,backend,crawler}"
   ```

3. Copy the built frontend:
   ```
   scp -r frontend/build/* your_username@your_server_ip:/var/www/voiceforpalestine.xyz/frontend/
   ```

4. Copy the backend files:
   ```
   scp -r backend/{package.json,package-lock.json,server.js,.env} your_username@your_server_ip:/var/www/voiceforpalestine.xyz/backend/
   ```

5. Copy the crawler files:
   ```
   scp -r crawler/{requirements.txt,crawler.py,contract_abi.json,.env} your_username@your_server_ip:/var/www/voiceforpalestine.xyz/crawler/
   ```

6. Install backend dependencies and start the service:
   ```
   ssh your_username@your_server_ip "cd /var/www/voiceforpalestine.xyz/backend && npm install"
   ```

7. Set up the Python virtual environment for the crawler:
   ```
   ssh your_username@your_server_ip "cd /var/www/voiceforpalestine.xyz/crawler && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
   ```

### 5. Setting Up Systemd Services

1. Copy the systemd service files to your server:
   ```
   scp systemd/voiceforpalestine-*.service your_username@your_server_ip:/tmp/
   ```

2. Move the service files to the systemd directory:
   ```
   ssh your_username@your_server_ip "sudo mv /tmp/voiceforpalestine-*.service /etc/systemd/system/"
   ```

3. Reload systemd, enable and start the services:
   ```
   ssh your_username@your_server_ip "sudo systemctl daemon-reload && sudo systemctl enable voiceforpalestine-backend.service voiceforpalestine-crawler.service && sudo systemctl start voiceforpalestine-backend.service voiceforpalestine-crawler.service"
   ```

## Verifying Deployment

1. Check if the services are running:
   ```
   ssh your_username@your_server_ip "sudo systemctl status voiceforpalestine-backend.service voiceforpalestine-crawler.service"
   ```

2. Check Nginx logs for any errors:
   ```
   ssh your_username@your_server_ip "sudo tail -f /var/log/nginx/voiceforpalestine.xyz-error.log"
   ```

3. Visit your website at `https://voiceforpalestine.xyz` to verify it's working correctly.

## Troubleshooting

- If you encounter permission issues, make sure the application directories are owned by the correct user:
  ```
  ssh your_username@your_server_ip "sudo chown -R www-data:www-data /var/www/voiceforpalestine.xyz"
  ```

- If the services fail to start, check the logs:
  ```
  ssh your_username@your_server_ip "sudo journalctl -u voiceforpalestine-backend.service -n 50"
  ssh your_username@your_server_ip "sudo journalctl -u voiceforpalestine-crawler.service -n 50"
  ```

- If the database connection fails, verify the database credentials in the `.env` files.
