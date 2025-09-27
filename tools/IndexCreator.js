const fs = require('fs');
const path = require('path');

// Paths
const templatePath = path.resolve('indextemplate.html');
const gamesJsonPath = path.resolve('public/games.json');
const outputPath = path.resolve('public/index.html');

// Load the template and games.json
const template = fs.readFileSync(templatePath, 'utf8');
const gamesData = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));

// Generate Hot Games HTML
function generateHotGames(games) {
  return games
    .filter((game) => game.hot === 1 && game.visible === 1)
    .map(
      (game) => `
        <a href="${game.path}">
          <div class="SmallBox">
            <img src="${game.image.startsWith('/') ? game.image.substring(1) : game.image}" 
                 loading="lazy" alt="${game.name}" width="80" height="80" class="Box-Image" />
            <div class="text-container">
              <h3 class="GameName">${game.name}</h3>
              <h3 class="AuthorName">${game.creator}</h3>
            </div>
          </div>
        </a>
      `
    )
    .join('');
}

// Generate Game List HTML
function generateGameList(games) {
  return games
    .filter((game) => game.visible === 1)
    .map(
      (game) => `
        <a href="${game.path}" alt="${game.name}">
          <img src="${game.image}" alt="${game.name}" width="150" height="150" loading="lazy" class="GameImgs" />
        </a>
      `
    )
    .join('');
}

function generateCategory(games, category) {
  const categoryLower = category.toLowerCase();
  return games
    .filter(
      (game) =>
        game.visible === 1 &&
        Array.isArray(game.categories) &&
        game.categories.some((cat) => cat.toLowerCase().includes(categoryLower))
    )
    .map(
      (game) => `
        <a href="${game.path}">
          <div class="SmallBox">
            <img src="${game.image.startsWith('/') ? game.image.substring(1) : game.image}" 
                 loading="lazy" alt="${game.name}" width="80" height="80" class="Box-Image" />
            <div class="text-container">
              <h3 class="GameName">${game.name}</h3>
              <h3 class="AuthorName">${game.creator}</h3>
            </div>
          </div>
        </a>
      `
    )
    .join('');
}


// Build sections
const hotGamesHTML = generateHotGames(gamesData.games);
const gameListHTML = generateGameList(gamesData.games);
const physicsHTML = generateCategory(gamesData.games, "Physics");
const numbersHTML = generateCategory(gamesData.games, "Numbers");
const sportsHTML = generateCategory(gamesData.games, "Sports");

// Replace placeholders
const updatedHTML = template
  .replace('<div class="Boxes" id="Boxes"></div>', `<div class="Boxes" id="Boxes">${hotGamesHTML}</div>`)
  .replace('<div class="game-select" id="gameid"></div>', `<div class="game-select" id="gameid">${gameListHTML}</div>`)
  .replace('<div class="Boxes" id="PhysicsBoxes"></div>', `<div class="Boxes" id="PhysicsBoxes">${physicsHTML}</div>`)
  .replace('<div class="Boxes" id="NumbersBoxes"></div>', `<div class="Boxes" id="NumbersBoxes">${numbersHTML}</div>`)
  .replace('<div class="Boxes" id="SportsBoxes"></div>', `<div class="Boxes" id="SportsBoxes">${sportsHTML}</div>`);

// Write generated HTML
fs.writeFileSync(outputPath, updatedHTML);
console.log('✅ index.html generated successfully at /index.html with categories and ads');
