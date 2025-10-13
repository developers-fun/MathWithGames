const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Convert PNG images to 150x150 WebP format
 * Usage: node tools/ConvertToWebP.js [input-directory] [output-directory]
 */

async function convertPngToWebP(inputDir, outputDir) {
    try {
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Read all files from input directory
        const files = fs.readdirSync(inputDir);
        const pngFiles = files.filter(file => 
            file.toLowerCase().endsWith('.png') || 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.jpeg')
        );

        console.log(`Found ${pngFiles.length} image files to convert`);

        let convertedCount = 0;
        let errorCount = 0;

        for (const file of pngFiles) {
            try {
                const inputPath = path.join(inputDir, file);
                const fileName = path.parse(file).name;
                const outputPath = path.join(outputDir, `${fileName}.webp`);

                console.log(`Converting: ${file} -> ${fileName}.webp`);

                await sharp(inputPath)
                    .resize(150, 150, {
                        fit: 'contain',
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    })
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                convertedCount++;
                console.log(`✓ Successfully converted ${file}`);
            } catch (error) {
                console.error(`✗ Error converting ${file}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n=== Conversion Summary ===');
        console.log(`Total files processed: ${pngFiles.length}`);
        console.log(`Successfully converted: ${convertedCount}`);
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
const outputDirectory = args[1] || './public/assets/image/webp';

// Validate input directory exists
if (!fs.existsSync(inputDirectory)) {
    console.error(`Error: Input directory '${inputDirectory}' does not exist`);
    process.exit(1);
}

console.log('PNG to WebP Converter Tool');
console.log('==========================');
console.log(`Input directory: ${inputDirectory}`);
console.log(`Output directory: ${outputDirectory}`);
console.log('');

// Run the conversion
convertPngToWebP(inputDirectory, outputDirectory); 