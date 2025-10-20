# PWA Icon Placeholders

This directory should contain the following PWA icons:

- `icon-192x192.png` - 192x192 pixel icon
- `icon-512x512.png` - 512x512 pixel icon
- `apple-touch-icon.png` - 180x180 pixel icon for iOS

## How to Generate Icons

You can generate these icons using one of the following methods:

### Option 1: Use an Online Generator

1. Visit [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload a square logo (at least 512x512)
3. Download the generated icons
4. Copy them to this directory

### Option 2: Use ImageMagick

If you have ImageMagick installed:

```bash
# Create a simple colored square as placeholder
convert -size 512x512 xc:#3b82f6 -gravity center -pointsize 200 -fill white -annotate +0+0 "📝" icon-512x512.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 180x180 apple-touch-icon.png
```

### Option 3: Use Figma/Canva

1. Create a 512x512 design with your app logo
2. Export as PNG at different sizes
3. Place them in this directory

## Temporary Placeholder

For development, you can use any square PNG images. The build will work with missing icons, but you'll see warnings in the console.

**Note**: Replace these placeholders before deploying to production!
