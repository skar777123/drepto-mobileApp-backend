#!/bin/bash
set -e

echo "🚀 Starting Deployment..."

# Navigate to project directory
cd "$(dirname "$0")"

# Pull latest code if using git
if [ -d ".git" ]; then
  echo "📥 Pulling latest git changes..."
  git pull origin main || git pull origin master
fi

# Build and restart containers using Docker Compose
echo "🐳 Rebuilding and restarting containers..."
docker compose down
docker compose up -d --build

# Remove unused/dangling docker images to save disk space
echo "🧹 Cleaning up unused Docker images..."
docker image prune -f

echo "✅ Deployment completed successfully!"
docker compose ps
