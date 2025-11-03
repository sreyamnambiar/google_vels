import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server is working!\n');
});

const port = 5000;
server.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Visit: http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});