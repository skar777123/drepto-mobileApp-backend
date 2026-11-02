#!/bin/bash
set -e

echo "🚀 Starting Deployment..."

# Navigate to project directory
cd "$(dirname "$0")"

# Sync with remote — always match the remote exactly (safe for deploy servers)
if [ -d ".git" ]; then
  echo "📥 Syncing with remote git..."
  BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "master")
  git fetch origin
  git reset --hard origin/"$BRANCH"
fi

# Ensure .env exists before touching Docker — fail early to avoid bringing containers down
if [ ! -f ".env" ]; then
  echo "❌ ERROR: .env file not found at $(pwd)/.env"
  echo "   Please create it on the server before deploying:"
  echo "   nano $(pwd)/.env"
  exit 1
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
