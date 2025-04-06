const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Define the target server you want to proxy to (e.g., your actual website server)
const targetServer = 'http://your-target-server.com';  // Replace with the server to proxy to

// Middleware to proxy all requests to the target server
app.use('*', createProxyMiddleware({
  target: targetServer,          // Target server where requests will be forwarded
  changeOrigin: true,            // Adjust the 'Origin' header to match the target server
  pathRewrite: {},               // No path rewrite - preserve the original path
  logLevel: 'debug',             // Optional: For debugging purposes
  onProxyReq: (proxyReq, req, res) => {
    // Optional: Modify the proxy request before it's sent to the target server
    // For example, add custom headers or log the request
    console.log(`Proxying request: ${req.method} ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Optional: Modify the response from the target server before sending to the client
    console.log(`Received response for: ${req.method} ${req.url}`);
  }
}));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
