#!/bin/bash

# BAEKON FL Image Download Script
# Downloads all images from FL articles and stores them locally

echo "🖼️  BAEKON FL Image Download Script"
echo "=================================="

# Create directories
mkdir -p public/images/fl-articles/denebian-probes
mkdir -p public/images/fl-articles/giselians

# Function to download image with retry
download_image() {
    local url=$1
    local output_path=$2
    local max_retries=3
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        if curl -L -o "$output_path" "$url" --silent --show-error; then
            echo "✅ Downloaded: $(basename "$output_path")"
            return 0
        else
            retry_count=$((retry_count + 1))
            echo "⚠️  Retry $retry_count/$max_retries for $(basename "$output_path")"
            sleep 1
        fi
    done
    
    echo "❌ Failed to download: $(basename "$output_path")"
    return 1
}

echo ""
echo "📥 Downloading Denebian Probes images..."

# Denebian Probes Images
download_image "https://i.postimg.cc/CLTxVXtV/16a.jpg" "public/images/fl-articles/denebian-probes/16a.jpg"
download_image "https://i.postimg.cc/dVJQhdwH/16b.jpg" "public/images/fl-articles/denebian-probes/16b.jpg"
download_image "https://i.postimg.cc/nc4cVTb9/16c.jpg" "public/images/fl-articles/denebian-probes/16c.jpg"
download_image "https://i.postimg.cc/3JW77XkB/5a.jpg" "public/images/fl-articles/denebian-probes/5a.jpg"
download_image "https://i.postimg.cc/52Yx5B10/3a.jpg" "public/images/fl-articles/denebian-probes/3a.jpg"
download_image "https://i.postimg.cc/Zq642JWz/3b.jpg" "public/images/fl-articles/denebian-probes/3b.jpg"
download_image "https://i.postimg.cc/hvZBTj5T/3c.jpg" "public/images/fl-articles/denebian-probes/3c.jpg"
download_image "https://i.postimg.cc/zXjyWJJB/3d.jpg" "public/images/fl-articles/denebian-probes/3d.jpg"
download_image "https://i.postimg.cc/jS7bnRQn/3e.jpg" "public/images/fl-articles/denebian-probes/3e.jpg"
download_image "https://i.postimg.cc/Kj8b1LJm/3f.jpg" "public/images/fl-articles/denebian-probes/3f.jpg"
download_image "https://i.postimg.cc/mgKqxLRW/s1.jpg" "public/images/fl-articles/denebian-probes/s1.jpg"
download_image "https://i.postimg.cc/fy5F1YW8/s2.jpg" "public/images/fl-articles/denebian-probes/s2.jpg"
download_image "https://i.postimg.cc/Wp7QDcm0/s3.jpg" "public/images/fl-articles/denebian-probes/s3.jpg"
download_image "https://i.postimg.cc/bJwRRQbt/35a.jpg" "public/images/fl-articles/denebian-probes/35a.jpg"
download_image "https://i.postimg.cc/131cdxwP/35b.jpg" "public/images/fl-articles/denebian-probes/35b.jpg"
download_image "https://i.postimg.cc/FHbg5PVS/35c.jpg" "public/images/fl-articles/denebian-probes/35c.jpg"
download_image "https://i.postimg.cc/GhNGD9Gt/12a.jpg" "public/images/fl-articles/denebian-probes/12a.jpg"
download_image "https://i.postimg.cc/VvLjzpMJ/12b.jpg" "public/images/fl-articles/denebian-probes/12b.jpg"
download_image "https://i.postimg.cc/XJB4YLQz/12c.jpg" "public/images/fl-articles/denebian-probes/12c.jpg"
download_image "https://i.postimg.cc/5ywJw0c5/12d.jpg" "public/images/fl-articles/denebian-probes/12d.jpg"
download_image "https://i.postimg.cc/Dyky8VVd/11a.jpg" "public/images/fl-articles/denebian-probes/11a.jpg"
download_image "https://i.postimg.cc/2jBSkktS/11b.jpg" "public/images/fl-articles/denebian-probes/11b.jpg"
download_image "https://i.postimg.cc/44Ms8HWf/2a.jpg" "public/images/fl-articles/denebian-probes/2a.jpg"
download_image "https://i.postimg.cc/Rh39SvZx/2b.jpg" "public/images/fl-articles/denebian-probes/2b.jpg"
download_image "https://i.postimg.cc/Gh2pNGJk/84.jpg" "public/images/fl-articles/denebian-probes/84.jpg"
download_image "https://i.postimg.cc/MZtTddR6/85.jpg" "public/images/fl-articles/denebian-probes/85.jpg"
download_image "https://i.postimg.cc/LX1tjGh8/51.jpg" "public/images/fl-articles/denebian-probes/51.jpg"
download_image "https://i.postimg.cc/ZqDH8rcV/38.jpg" "public/images/fl-articles/denebian-probes/38.jpg"
download_image "https://i.postimg.cc/mDJdsQ1t/30.jpg" "public/images/fl-articles/denebian-probes/30.jpg"
download_image "https://i.postimg.cc/5yXmKjPb/11.jpg" "public/images/fl-articles/denebian-probes/11.jpg"
download_image "https://i.postimg.cc/9Q02TkPL/18.jpg" "public/images/fl-articles/denebian-probes/18.jpg"
download_image "https://i.postimg.cc/t4cjzz2p/19.jpg" "public/images/fl-articles/denebian-probes/19.jpg"
download_image "https://i.postimg.cc/W4Zb1zq9/74.jpg" "public/images/fl-articles/denebian-probes/74.jpg"
download_image "https://i.postimg.cc/ZYjk1QVQ/75.jpg" "public/images/fl-articles/denebian-probes/75.jpg"
download_image "https://i.postimg.cc/8Cx7nJD6/7.jpg" "public/images/fl-articles/denebian-probes/7.jpg"
download_image "https://i.postimg.cc/7675vHYQ/8.jpg" "public/images/fl-articles/denebian-probes/8.jpg"
download_image "https://i.postimg.cc/HWwrBkNr/9.jpg" "public/images/fl-articles/denebian-probes/9.jpg"
download_image "https://i.postimg.cc/ZnSC4GWY/10.jpg" "public/images/fl-articles/denebian-probes/10.jpg"
download_image "https://i.postimg.cc/kX7BZdrf/11.jpg" "public/images/fl-articles/denebian-probes/11.jpg"
download_image "https://i.postimg.cc/tCDYGmpy/12.jpg" "public/images/fl-articles/denebian-probes/12.jpg"
download_image "https://i.postimg.cc/J05tnpXN/13.jpg" "public/images/fl-articles/denebian-probes/13.jpg"
download_image "https://i.postimg.cc/fTxdzxS1/31.jpg" "public/images/fl-articles/denebian-probes/31.jpg"
download_image "https://i.postimg.cc/YqcgBX01/32.jpg" "public/images/fl-articles/denebian-probes/32.jpg"
download_image "https://i.postimg.cc/N0P9JDZ2/33.jpg" "public/images/fl-articles/denebian-probes/33.jpg"
download_image "https://i.postimg.cc/BvvPBk7G/34.jpg" "public/images/fl-articles/denebian-probes/34.jpg"
download_image "https://i.postimg.cc/PxgLhxXt/35.jpg" "public/images/fl-articles/denebian-probes/35.jpg"
download_image "https://i.postimg.cc/SNpXvJ1d/36.jpg" "public/images/fl-articles/denebian-probes/36.jpg"
download_image "https://i.postimg.cc/DfGJ6q6m/37.jpg" "public/images/fl-articles/denebian-probes/37.jpg"
download_image "https://i.postimg.cc/XYR64Gw0/fl16.jpg" "public/images/fl-articles/denebian-probes/fl16.jpg"
download_image "https://i.postimg.cc/HWzmXLCQ/fl17.jpg" "public/images/fl-articles/denebian-probes/fl17.jpg"
download_image "https://i.postimg.cc/ZR2zWdwr/fl18.jpg" "public/images/fl-articles/denebian-probes/fl18.jpg"
download_image "https://i.postimg.cc/RF9rJkss/fl19.jpg" "public/images/fl-articles/denebian-probes/fl19.jpg"
download_image "https://i.postimg.cc/kXhdYhGG/fl20.jpg" "public/images/fl-articles/denebian-probes/fl20.jpg"

echo ""
echo "🎉 Image download complete!"
echo "📁 Images stored in: public/images/fl-articles/"
echo ""
echo "Next steps:"
echo "1. Run this script: bash scripts/download-fl-images.sh"
echo "2. Update markdown files to use local image paths"
echo "3. Images will be available at /images/fl-articles/[category]/[filename]"
