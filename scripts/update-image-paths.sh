#!/bin/bash

# BAEKON Image Path Update Script
# Updates markdown files to use local image paths instead of external URLs

echo "🔄 BAEKON Image Path Update Script"
echo "=================================="

# Function to update image paths in markdown files
update_markdown_images() {
    local file_path=$1
    local category=$2
    
    echo "📝 Updating: $(basename "$file_path")"
    
    # Create backup
    cp "$file_path" "${file_path}.backup"
    
    # Update image paths using sed
    sed -i '' 's|https://i.postimg.cc/CLTxVXtV/16a.jpg|/images/fl-articles/'$category'/16a.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/dVJQhdwH/16b.jpg|/images/fl-articles/'$category'/16b.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/nc4cVTb9/16c.jpg|/images/fl-articles/'$category'/16c.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/3JW77XkB/5a.jpg|/images/fl-articles/'$category'/5a.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/52Yx5B10/3a.jpg|/images/fl-articles/'$category'/3a.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/Zq642JWz/3b.jpg|/images/fl-articles/'$category'/3b.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/hvZBTj5T/3c.jpg|/images/fl-articles/'$category'/3c.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/zXjyWJJB/3d.jpg|/images/fl-articles/'$category'/3d.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/jS7bnRQn/3e.jpg|/images/fl-articles/'$category'/3e.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/Kj8b1LJm/3f.jpg|/images/fl-articles/'$category'/3f.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/mgKqxLRW/s1.jpg|/images/fl-articles/'$category'/s1.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/fy5F1YW8/s2.jpg|/images/fl-articles/'$category'/s2.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/Wp7QDcm0/s3.jpg|/images/fl-articles/'$category'/s3.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/bJwRRQbt/35a.jpg|/images/fl-articles/'$category'/35a.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/131cdxwP/35b.jpg|/images/fl-articles/'$category'/35b.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/FHbg5PVS/35c.jpg|/images/fl-articles/'$category'/35c.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/GhNGD9Gt/12a.jpg|/images/fl-articles/'$category'/12a.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/VvLjzpMJ/12b.jpg|/images/fl-articles/'$category'/12b.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/XJB4YLQz/12c.jpg|/images/fl-articles/'$category'/12c.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/5ywJw0c5/12d.jpg|/images/fl-articles/'$category'/12d.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/Dyky8VVd/11a.jpg|/images/fl-articles/'$category'/11a.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/2jBSkktS/11b.jpg|/images/fl-articles/'$category'/11b.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/44Ms8HWf/2a.jpg|/images/fl-articles/'$category'/2a.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/Rh39SvZx/2b.jpg|/images/fl-articles/'$category'/2b.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/Gh2pNGJk/84.jpg|/images/fl-articles/'$category'/84.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/MZtTddR6/85.jpg|/images/fl-articles/'$category'/85.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/LX1tjGh8/51.jpg|/images/fl-articles/'$category'/51.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/ZqDH8rcV/38.jpg|/images/fl-articles/'$category'/38.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/mDJdsQ1t/30.jpg|/images/fl-articles/'$category'/30.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/5yXmKjPb/11.jpg|/images/fl-articles/'$category'/11.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/9Q02TkPL/18.jpg|/images/fl-articles/'$category'/18.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/t4cjzz2p/19.jpg|/images/fl-articles/'$category'/19.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/W4Zb1zq9/74.jpg|/images/fl-articles/'$category'/74.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/ZYjk1QVQ/75.jpg|/images/fl-articles/'$category'/75.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/8Cx7nJD6/7.jpg|/images/fl-articles/'$category'/7.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/7675vHYQ/8.jpg|/images/fl-articles/'$category'/8.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/HWwrBkNr/9.jpg|/images/fl-articles/'$category'/9.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/ZnSC4GWY/10.jpg|/images/fl-articles/'$category'/10.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/kX7BZdrf/11.jpg|/images/fl-articles/'$category'/11.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/tCDYGmpy/12.jpg|/images/fl-articles/'$category'/12.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/J05tnpXN/13.jpg|/images/fl-articles/'$category'/13.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/fTxdzxS1/31.jpg|/images/fl-articles/'$category'/31.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/YqcgBX01/32.jpg|/images/fl-articles/'$category'/32.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/N0P9JDZ2/33.jpg|/images/fl-articles/'$category'/33.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/BvvPBk7G/34.jpg|/images/fl-articles/'$category'/34.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/PxgLhxXt/35.jpg|/images/fl-articles/'$category'/35.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/SNpXvJ1d/36.jpg|/images/fl-articles/'$category'/36.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/DfGJ6q6m/37.jpg|/images/fl-articles/'$category'/37.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/XYR64Gw0/fl16.jpg|/images/fl-articles/'$category'/fl16.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/HWzmXLCQ/fl17.jpg|/images/fl-articles/'$category'/fl17.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/ZR2zWdwr/fl18.jpg|/images/fl-articles/'$category'/fl18.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/RF9rJkss/fl19.jpg|/images/fl-articles/'$category'/fl19.jpg|g' "$file_path"
    sed -i '' 's|https://i.postimg.cc/kXhdYhGG/fl20.jpg|/images/fl-articles/'$category'/fl20.jpg|g' "$file_path"
}

echo ""
echo "🔄 Updating Denebian Probes markdown files..."

# Update all Denebian Probes markdown files
for file in fl-knowledge-base/denebian-probes/*.md; do
    if [ -f "$file" ]; then
        update_markdown_images "$file" "denebian-probes"
    fi
done

echo ""
echo "✅ Image path updates complete!"
echo "📁 All markdown files now reference local images"
echo "🖼️  Images available at: /images/fl-articles/[category]/[filename]"
echo ""
echo "🗑️  Backup files created with .backup extension"
echo "   You can remove them after verifying everything works correctly"
