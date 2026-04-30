const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const inputDir = './raw-images';
  const outputDir = './public/images/products';
  
  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
    console.log(`Created ${inputDir}. Please place images there and run again.`);
    return;
  }

  const files = fs.readdirSync(inputDir).filter(file => !file.startsWith('.'));
  
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputName = path.parse(file).name;
    
    try {
      // Generate WebP
      await sharp(inputPath)
        .resize(1200, 1200, { fit: 'cover', position: 'center' })
        .webp({ quality: 90 })
        .toFile(path.join(outputDir, 'primary', `${outputName}.webp`));
      
      // Generate JPEG fallback
      await sharp(inputPath)
        .resize(1200, 1200, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85 })
        .toFile(path.join(outputDir, 'primary', `${outputName}.jpg`));
      
      // Generate thumbnail
      await sharp(inputPath)
        .resize(400, 400, { fit: 'cover', position: 'center' })
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, 'thumbnails', `${outputName}-thumb.webp`));
      
      console.log(`✓ Processed: ${file}`);
    } catch (e) {
      console.error(`✗ Failed to process ${file}:`, e);
    }
  }
}

optimizeImages();
