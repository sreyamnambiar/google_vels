const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body>
        <h1>🎉 Simple Test Server Works!</h1>
        <p>Port 8080 is working</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

server.listen(8080, '0.0.0.0', () => {
  console.log('✅ Simple test server running on port 8080');
  console.log('✅ Visit: http://localhost:8080');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});