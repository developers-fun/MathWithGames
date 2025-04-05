#!/bin/bash
echo "Installing npm packages..."
npm install

echo "Running JSON Converter..."
node tools/ConvertJson.js

echo "Running Game File Creator..."
node tools/CreateGameFiles.js

echo "Running Index Creator"
node tools/IndexCreator.js

echo "Running Sitemap Creator"
node tools/ConvertJson.js

echo "Deleting node_modules..."
rm -rf node_modules

echo "Done!"