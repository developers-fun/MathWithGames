const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Resize images to 150x150 pixels
 * Usage: node tools/ResizeImages.js [input-directory] [output-directory]
 */

async function resizeImages(inputDir, outputDir) {
    try {
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Read all files from input directory
        const files = fs.readdirSync(inputDir);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'].includes(ext);
        });

        console.log(`Found ${imageFiles.length} image files to resize`);

        let resizedCount = 0;
        let errorCount = 0;

        for (const file of imageFiles) {
            try {
                const inputPath = path.join(inputDir, file);
                const outputPath = path.join(outputDir, file);
                const ext = path.extname(file).toLowerCase();

                console.log(`Resizing: ${file} -> 150x150`);

                // Get image info to check if it's already 150x150
                const imageInfo = await sharp(inputPath).metadata();
                
                if (imageInfo.width === 150 && imageInfo.height === 150) {
                    console.log(`⚠ ${file} is already 150x150, skipping...`);
                    continue;
                }

                let sharpInstance = sharp(inputPath).resize(150, 150, {
                    fit: 'fill', // Force exact 150x150 size
                    background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for non-transparent formats
                });

                // Handle different output formats
                switch (ext) {
                    case '.png':
                        sharpInstance = sharpInstance.png();
                        break;
                    case '.jpg':
                    case '.jpeg':
                        sharpInstance = sharpInstance.jpeg({ quality: 90 });
                        break;
                    case '.webp':
                        sharpInstance = sharpInstance.webp({ quality: 80 });
                        break;
                    case '.gif':
                        sharpInstance = sharpInstance.gif();
                        break;
                    default:
                        sharpInstance = sharpInstance.png(); // Default to PNG
                }

                await sharpInstance.toFile(outputPath);

                resizedCount++;
                console.log(`✓ Successfully resized ${file} to 150x150`);
            } catch (error) {
                console.error(`✗ Error resizing ${file}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n=== Resize Summary ===');
        console.log(`Total files processed: ${imageFiles.length}`);
        console.log(`Successfully resized: ${resizedCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log(`Output directory: ${outputDir}`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Get command line arguments
const args = process.argv.slice(2);
const inputDirectory = args[0] || './public/assets/image';
const outputDirectory = args[1] || './public/assets/image/150x150';

// Validate input directory exists
if (!fs.existsSync(inputDirectory)) {
    console.error(`Error: Input directory '${inputDirectory}' does not exist`);
    process.exit(1);
}

console.log('Image Resizer Tool - 150x150');
console.log('============================');
console.log(`Input directory: ${inputDirectory}`);
console.log(`Output directory: ${outputDirectory}`);
console.log('');

// Run the resize operation
resizeImages(inputDirectory, outputDirectory); 