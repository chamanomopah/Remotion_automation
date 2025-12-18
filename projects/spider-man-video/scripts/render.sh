#!/bin/bash
# Render script for Spider-Man Video Project

echo "🎬 Rendering Spider-Man Video..."

# Check if build exists
if [ ! -d "dist" ]; then
    echo "❌ Build not found! Running build first..."
    npm run build
fi

# Create exports directory if it doesn't exist
mkdir -p exports/drafts

# Render the video
echo "🎥 Starting render process..."
npm run render

# Check if render was successful
if [ $? -eq 0 ]; then
    echo "✅ Renderização concluída com sucesso!"
    echo "📍 Vídeo salvo em: exports/drafts/"
    echo "🎯 Ready for post-processing!"
else
    echo "❌ Render failed!"
    exit 1
fi

echo "🕷️ Spider-Man video rendering complete!"