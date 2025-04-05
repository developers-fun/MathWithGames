const { execSync } = require('child_process');
const path = require('path');

// Utility to run shell commands and log output
function runCommand(command, description) {
  try {
    console.log(`🚀 ${description}...`);
    const output = execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed!\n`);
    return output;
  } catch (error) {
    console.error(`❌ Error during ${description}: ${error.message}`);
    process.exit(1);
  }
}

// Set paths
const toolsPath = path.resolve(__dirname, 'tools');

// Task list
const tasks = [
  { command: 'npm install', description: 'Installing npm packages' },
  { command: `node ${path.join(toolsPath, 'ConvertJson.js')}`, description: 'Running JSON Converter' },
  { command: `node ${path.join(toolsPath, 'CreateGameFiles.js')}`, description: 'Running Game File Creator' },
  { command: `node ${path.join(toolsPath, 'IndexCreator.js')}`, description: 'Running index.html Creator' },
  { command: `node ${path.join(toolsPath, 'GenerateSitemap.js')}`, description: 'Running Sitemap Creator' },
];

// Run all tasks sequentially
tasks.forEach((task) => {
  runCommand(task.command, task.description);
});

console.log('🎉 All tasks completed successfully!');
