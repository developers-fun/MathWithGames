const fs = require('fs');
const path = require('path');

// Define the template variable
const template = fs.readFileSync(path.resolve("gametemplate.html"), 'utf8');

// Utility to delete all children of a directory
function clearDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                // Recursively delete subdirectories
                fs.rmSync(curPath, { recursive: true, force: true });
            } else {
                // Delete files
                fs.unlinkSync(curPath);
            }
        });
    }
}

function main() {
    let errors = 0;
    let files = 0;

    const outputDir = 'public/g'; // Set output directory to 'g'

    // Create 'g' directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    } else {
        // Clear all contents of 'g' before regenerating files
        clearDirectory(outputDir);
    }

    const gamesData = JSON.parse(fs.readFileSync(path.resolve("public/games.json"), 'utf8'));
    gamesData.games.forEach((game) => {
        try {
            if (game.visible === 1) {
                // Ensure iframepath is defined
                if (!game.iframepath) {
                    console.error(`Error: IframePath is undefined for game: ${game.name}`);
                    return;
                }

                // Ensure image is defined
                if (!game.image) {
                    console.error(`Error: Image is undefined for game: ${game.name}`);
                    return;
                }

                const newFileName = `${game.name.toLowerCase().replace(/\s+/g, '')}.html`; // Remove spaces and hyphens
                const newFilePath = path.join(outputDir, newFileName);

                // Replace keywords in the template
                const creator = game.creator.replace(/-/g, ' ');
                const name = game.name.replace(/-/g, ' ');
                const img = game.image.replace(/-/g, '').toLowerCase();
                let newContent = template
                    .replace(/GamePathInsert/g, game.iframepath)
                    .replace(/GameImgInsert/g, img)
                    .replace(/GameNameInsert/g, name)
                    .replace(/CreatorNameInsert/g, creator);

                // Write the new file
                fs.writeFileSync(newFilePath, newContent);
                files++;
            }
        } catch (error) {
            console.error(`Error processing game: ${game.name}. Error: ${error.message}`);
            errors++;
        }
    });

    console.log(`🏗️ Build completed with ${errors} error(s) and ${files} total file(s).`);
}

main();

module.exports = main;
