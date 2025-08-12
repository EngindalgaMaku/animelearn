#!/bin/sh

echo "🚀 Starting application..."

# Check if DATABASE_URL is available
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL not found in environment variables"
    echo "📋 Available environment variables:"
    env | grep -E "(DATABASE|NEXTAUTH|GOOGLE)" || echo "No database/auth related variables found"
else
    echo "✅ DATABASE_URL found, regenerating Prisma client..."
    npx prisma generate
fi

echo "🏃 Starting Next.js server..."
exec node server.js