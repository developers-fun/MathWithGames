const fs = require("fs");
const path = require("path");

const targetFolder = path.resolve('public/g'); // Adjusted for tools folder
const sitemapFile = path.resolve('public/sitemap.xml'); // Save sitemap in project root
const domain = "https://coldnova.xyz"; // Change this to your actual domain

// Function to get all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (err) {
        console.error("Error reading directory:", err.message);
        return fileList;
    }

    files.forEach(file => {
        const filePath = path.join(dir, file);
        try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                getHtmlFiles(filePath, fileList);
            } else if (file.endsWith(".html")) {
                fileList.push(filePath);
            }
        } catch (err) {
            console.error("Error reading file stats:", err.message);
        }
    });

    return fileList;
}

// Function to generate sitemap XML
function generateSitemap(files) {
    const lastMod = new Date().toISOString().split("T")[0]; // SEO-friendly YYYY-MM-DD
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    let rootIndexIncluded = false;

    files.forEach(file => {
        let relativePath = path.relative("./", file);

        // Check for the root index.html explicitly
        if (relativePath === "index.html") {
            relativePath = ""; // Root domain "/"
            rootIndexIncluded = true;
        }

        // If it's an index.html inside a subfolder, rewrite it as the folder path
        if (relativePath.endsWith("index.html")) {
            relativePath = relativePath.replace(/index\.html$/, "");
        }

        xmlContent += `  <url>\n`;
        xmlContent += `    <loc>${domain}/${relativePath}</loc>\n`;
        xmlContent += `    <lastmod>${lastMod}</lastmod>\n`;
        xmlContent += `    <changefreq>weekly</changefreq>\n`;
        xmlContent += `    <priority>0.8</priority>\n`;
        xmlContent += `  </url>\n`;
    });

    // Ensure the root landing page is added if it wasn't detected
    if (!rootIndexIncluded) {
        xmlContent += `  <url>\n`;
        xmlContent += `    <loc>${domain}/</loc>\n`;
        xmlContent += `    <lastmod>${lastMod}</lastmod>\n`;
        xmlContent += `    <changefreq>weekly</changefreq>\n`;
        xmlContent += `    <priority>1.0</priority>\n`;
        xmlContent += `  </url>\n`;
    }

    xmlContent += `</urlset>`;

    return xmlContent;
}

// Main execution
const htmlFiles = getHtmlFiles(targetFolder);

if (htmlFiles.length === 0) {
    console.log("No HTML files found.");
} else {
    const sitemapContent = generateSitemap(htmlFiles);
    fs.writeFileSync(sitemapFile, sitemapContent, "utf8");
    console.log(`✅ Sitemap generated successfully: ${sitemapFile}`);
}
