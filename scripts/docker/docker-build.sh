#!/bin/bash

# Docker build script with environment variables
# This script reads from .env file and passes variables as build args

set -e

echo "🐳 Building Docker image with environment variables..."

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded environment variables from .env"
else
    echo "❌ .env file not found! Please create one with your environment variables."
    exit 1
fi

# Build the Docker image with build args
docker build \
    --build-arg DATABASE_URL="$DATABASE_URL" \
    --build-arg NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
    --build-arg NEXTAUTH_URL="$NEXTAUTH_URL" \
    --build-arg GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
    --build-arg GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
    --build-arg NEXT_PUBLIC_GA_ID="$NEXT_PUBLIC_GA_ID" \
    -t anime-card-manager:latest \
    .

echo "🎉 Docker build completed successfully!"
echo "🚀 To run the container:"
echo "   docker run -p 3000:3000 --env-file .env anime-card-manager:latest"