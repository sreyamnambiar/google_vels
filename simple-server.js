import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InclusiveHub AI Platform is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 InclusiveHub running on http://localhost:${PORT}`);
  console.log(`📱 Simple Browser: http://localhost:${PORT}`);
});