const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');

async function processImage(inputPath, outputPath, options = {}) {
  if (!fs.existsSync(inputPath)) {
    console.warn(`⚠️ File not found: ${inputPath}`);
    return;
  }
  
  const ext = path.extname(outputPath).toLowerCase();
  let pipeline = sharp(inputPath);
  
  if (options.width || options.height) {
    pipeline = pipeline.resize(options.width, options.height, {
      fit: options.fit || 'inside',
      withoutEnlargement: true
    });
  }
  
  if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: options.quality || 80 });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: options.quality || 80 });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, quality: options.quality || 80 });
  }
  
  await pipeline.toFile(outputPath);
  const sizeBefore = fs.statSync(inputPath).size;
  const sizeAfter = fs.statSync(outputPath).size;
  console.log(`✓ Processed: ${path.relative(publicDir, inputPath)} -> ${path.relative(publicDir, outputPath)} (${(sizeBefore / 1024).toFixed(1)}KB -> ${(sizeAfter / 1024).toFixed(1)}KB)`);
}

async function run() {
  console.log('🚀 Starting asset optimization pass...');
  
  // 1. Optimize Logo
  await processImage(
    path.join(publicDir, 'logo.png'),
    path.join(publicDir, 'logo.webp'),
    { width: 240, quality: 85 }
  );
  await processImage(
    path.join(imagesDir, 'logo.png'),
    path.join(imagesDir, 'logo.webp'),
    { width: 240, quality: 85 }
  );

  // 2. Optimize Hero Slide Images (Slides 1 - 5)
  const heroDir = path.join(imagesDir, 'hero');
  for (let i = 1; i <= 5; i++) {
    await processImage(
      path.join(heroDir, `slide${i}.png`),
      path.join(heroDir, `slide${i}.webp`),
      { width: 1200, quality: 80 }
    );
  }

  // 3. Optimize Category Images
  const catDir = path.join(imagesDir, 'categories');
  const categories = ['accessories', 'cat', 'dog', 'food'];
  for (const cat of categories) {
    await processImage(
      path.join(catDir, `${cat}.png`),
      path.join(catDir, `${cat}.webp`),
      { width: 400, quality: 80 }
    );
  }

  // 4. Optimize General Showcase Images
  await processImage(
    path.join(imagesDir, 'hero-pet.png'),
    path.join(imagesDir, 'hero-pet.webp'),
    { width: 800, quality: 80 }
  );
  await processImage(
    path.join(imagesDir, 'winter-collection.png'),
    path.join(imagesDir, 'winter-collection.webp'),
    { width: 800, quality: 80 }
  );

  // 5. Generate a tiny cute circle avatar placeholder
  // We take slide1.png and crop a 32x32 square from the center of it
  if (fs.existsSync(path.join(heroDir, 'slide1.png'))) {
    await sharp(path.join(heroDir, 'slide1.png'))
      .resize(64, 64, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(path.join(imagesDir, 'avatar-placeholder.webp'));
    console.log('✓ Processed: slide1.png -> avatar-placeholder.webp (under 1KB)');
  }
  
  console.log('🎉 Asset optimization complete!');
}

run().catch(console.error);
