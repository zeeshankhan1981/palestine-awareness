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
