#!/bin/bash
# Export script for Spider-Man Video Project

echo "📤 Exporting Spider-Man Final Video..."

# Create final exports directory
mkdir -p exports/final

# Get current date for filename
DATE=$(date +"%Y-%m-%d")
OUTPUT_FILE="spider-man-video-${DATE}.mp4"

# Export with optimal settings for YouTube/social media
echo "🎯 Exporting final video..."
npm run export -- --out="exports/final/${OUTPUT_FILE}" --prores=false --jpeg-quality=90

# Check if export was successful
if [ $? -eq 0 ]; then
    echo "✅ Exportação finalizada com sucesso!"
    echo "📍 Vídeo final salvo em: exports/final/${OUTPUT_FILE}"
    echo "📊 File size: $(du -h "exports/final/${OUTPUT_FILE}" | cut -f1)"
    echo "🎯 Ready for YouTube upload!"

    # Create social media versions
    echo "📱 Creating social media versions..."
    mkdir -p exports/social

    # Generate thumbnail suggestion
    echo "🖼️ Thumbnail suggestions:"
    echo "   - Spider-Man mask with NY reflection at 00:30"
    echo "   - Three Spider-Men moment at 17:45"
    echo "   - Final shot with all versions at 19:50"

else
    echo "❌ Export failed!"
    exit 1
fi

echo "🕷️ Spider-Man project export complete!"