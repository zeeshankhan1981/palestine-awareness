#!/bin/bash

# Palestine News Hub - Local Development Script
# This script starts all services needed for local development

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to display section headers
section() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Function to display success messages
success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to display warning messages
warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to display error messages
error() {
  echo -e "${RED}✗ $1${NC}"
}

# Function to check if a port is in use
is_port_in_use() {
  lsof -i:"$1" >/dev/null 2>&1
}

# Function to kill a process using a specific port
kill_process_on_port() {
  local port=$1
  if is_port_in_use "$port"; then
    warning "Port $port is already in use. Attempting to kill the process..."
    lsof -ti:"$port" | xargs kill -9
    sleep 1
    if ! is_port_in_use "$port"; then
      success "Successfully freed port $port"
    else
      warning "Failed to free port $port. Will try to use a different port."
      return 1
    fi
  fi
  return 0
}

# Check for required dependencies
section "Checking dependencies"

# Check for Node.js
if ! command_exists node; then
  error "Node.js is not installed. Please install Node.js and try again."
  exit 1
fi
success "Node.js is installed: $(node --version)"

# Check for npm
if ! command_exists npm; then
  error "npm is not installed. Please install npm and try again."
  exit 1
fi
success "npm is installed: $(npm --version)"

# Check for Python
if ! command_exists python3; then
  error "Python 3 is not installed. Please install Python 3 and try again."
  exit 1
fi
success "Python 3 is installed: $(python3 --version)"

# Check for pip
if ! command_exists pip3; then
  error "pip3 is not installed. Please install pip3 and try again."
  exit 1
fi
success "pip3 is installed: $(pip3 --version)"

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR" || exit 1
success "Working directory: $BASE_DIR"

# Free up required ports
section "Freeing up required ports"
kill_process_on_port 3000  # Frontend
kill_process_on_port 3001  # Backend

# Try port 5000 for crawler, if not available, use 5001
CRAWLER_PORT=5000
if ! kill_process_on_port 5000; then
  warning "Will use port 5001 for crawler instead of port 5000"
  CRAWLER_PORT=5001
  kill_process_on_port 5001
fi

# Install dependencies if needed
section "Installing dependencies"

# Backend dependencies
if [ ! -d "$BASE_DIR/backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  (cd "$BASE_DIR/backend" && npm install)
  if [ $? -eq 0 ]; then
    success "Backend dependencies installed successfully"
  else
    error "Failed to install backend dependencies"
    exit 1
  fi
else
  success "Backend dependencies already installed"
fi

# Frontend dependencies
if [ ! -d "$BASE_DIR/frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  (cd "$BASE_DIR/frontend" && npm install)
  if [ $? -eq 0 ]; then
    success "Frontend dependencies installed successfully"
  else
    error "Failed to install frontend dependencies"
    exit 1
  fi
else
  success "Frontend dependencies already installed"
fi

# Crawler dependencies
if [ ! -d "$BASE_DIR/crawler/venv" ]; then
  echo "Creating Python virtual environment for crawler..."
  python3 -m venv "$BASE_DIR/crawler/venv"
  if [ $? -eq 0 ]; then
    success "Python virtual environment created successfully"
  else
    error "Failed to create Python virtual environment"
    exit 1
  fi
fi

echo "Installing crawler dependencies..."
source "$BASE_DIR/crawler/venv/bin/activate"
pip3 install -r "$BASE_DIR/crawler/requirements.txt"
if [ $? -eq 0 ]; then
  success "Crawler dependencies installed successfully"
else
  error "Failed to install crawler dependencies"
  exit 1
fi
deactivate

# Create .env files if they don't exist
section "Setting up environment files"

# Backend .env
if [ ! -f "$BASE_DIR/backend/.env" ]; then
  echo "Creating backend .env file..."
  cat > "$BASE_DIR/backend/.env" << EOF
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/palestine_news_hub
CORS_ORIGIN=http://localhost:3000
CONTRACT_ADDRESS=
POLYGON_RPC_URL=
EOF
  success "Backend .env file created"
else
  success "Backend .env file already exists"
fi

# Crawler .env
if [ ! -f "$BASE_DIR/crawler/.env" ]; then
  echo "Creating crawler .env file..."
  cat > "$BASE_DIR/crawler/.env" << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/palestine_news_hub
API_ENDPOINT=http://localhost:3001/api
CRAWL_INTERVAL=3600
PORT=$CRAWLER_PORT
EOF
  success "Crawler .env file created"
else
  # Update the crawler port in the .env file
  if grep -q "PORT=" "$BASE_DIR/crawler/.env"; then
    sed -i '' "s/PORT=.*/PORT=$CRAWLER_PORT/" "$BASE_DIR/crawler/.env"
  else
    echo "PORT=$CRAWLER_PORT" >> "$BASE_DIR/crawler/.env"
  fi
  success "Updated crawler .env file with port $CRAWLER_PORT"
fi

# Start all services
section "Starting services"

# Start the backend
echo "Starting backend service..."
(cd "$BASE_DIR/backend" && npm run dev) &
BACKEND_PID=$!
success "Backend started with PID: $BACKEND_PID"

# Start the frontend
echo "Starting frontend service..."
(cd "$BASE_DIR/frontend" && npm start) &
FRONTEND_PID=$!
success "Frontend started with PID: $FRONTEND_PID"

# Start the crawler
echo "Starting crawler service..."
(source "$BASE_DIR/crawler/venv/bin/activate" && cd "$BASE_DIR/crawler" && python3 crawler.py) &
CRAWLER_PID=$!
success "Crawler started with PID: $CRAWLER_PID"

# Save PIDs to a file for easy cleanup
echo "$BACKEND_PID $FRONTEND_PID $CRAWLER_PID" > "$BASE_DIR/.dev-pids"

section "Development environment is ready!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001/api"
echo "Crawler is running in the background on port $CRAWLER_PORT"
echo ""
echo "To stop all services, run: ./stop-local-dev.sh"

# Create a stop script
cat > "$BASE_DIR/stop-local-dev.sh" << 'EOF'
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display success messages
success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to display error messages
error() {
  echo -e "${RED}✗ $1${NC}"
}

# Set the base directory
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR" || exit 1

# Check if PID file exists
if [ ! -f "$BASE_DIR/.dev-pids" ]; then
  error "No running development services found"
  exit 1
fi

# Read PIDs from file
read -r BACKEND_PID FRONTEND_PID CRAWLER_PID < "$BASE_DIR/.dev-pids"

# Kill processes
kill -9 $BACKEND_PID 2>/dev/null
if [ $? -eq 0 ]; then
  success "Backend service stopped (PID: $BACKEND_PID)"
else
  error "Failed to stop backend service (PID: $BACKEND_PID)"
fi

kill -9 $FRONTEND_PID 2>/dev/null
if [ $? -eq 0 ]; then
  success "Frontend service stopped (PID: $FRONTEND_PID)"
else
  error "Failed to stop frontend service (PID: $FRONTEND_PID)"
fi

kill -9 $CRAWLER_PID 2>/dev/null
if [ $? -eq 0 ]; then
  success "Crawler service stopped (PID: $CRAWLER_PID)"
else
  error "Failed to stop crawler service (PID: $CRAWLER_PID)"
fi

# Remove PID file
rm "$BASE_DIR/.dev-pids"
success "All development services have been stopped"
EOF

chmod +x "$BASE_DIR/stop-local-dev.sh"
success "Created stop script: ./stop-local-dev.sh"
