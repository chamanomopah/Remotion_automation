#!/bin/bash
# Build script for Spider-Man Video Project

echo "🕷️ Building Spider-Man Video Project..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Build the project
echo "🔨 Building Remotion project..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completo para spider-man-video"
    echo "📍 Build files in: dist/"
    echo "🚀 Ready for rendering!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🕷️ Spider-Man project build complete!"