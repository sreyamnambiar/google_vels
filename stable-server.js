const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

console.log('🚀 Starting InclusiveHub Server...');
console.log('📁 Current directory:', __dirname);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist/public')));

// Routes
app.get('/', (req, res) => {
  console.log('📄 Serving main page');
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.get('/api/health', (req, res) => {
  console.log('💗 Health check requested');
  res.json({ 
    status: 'healthy', 
    message: 'InclusiveHub AI Platform is running!',
    timestamp: new Date().toISOString()
  });
});

// Gemini API mock endpoints for testing
app.post('/api/chat', (req, res) => {
  console.log('💬 Chat API called');
  res.json({ 
    response: "Hello! I'm your AI accessibility assistant. How can I help you today?",
    timestamp: new Date().toISOString()
  });
});

app.post('/api/vision-analyze', (req, res) => {
  console.log('👁️ Vision API called');
  res.json({ 
    analysis: {
      accessibility: { score: 8, issues: [], improvements: ["Great accessibility!"] },
      safety: { hazards: [], recommendations: ["Continue good practices"] },
      description: "This appears to be an accessible environment."
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('🎉 InclusiveHub AI Platform is LIVE!');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📱 Simple Browser: http://localhost:${PORT}`);
  console.log('🚀 Ready for hackathon demo!');
});

// Keep alive
process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
  });
});

module.exports = app;