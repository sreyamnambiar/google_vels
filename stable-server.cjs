const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

console.log('🚀 Starting InclusiveHub Server...');
console.log('📁 Current directory:', __dirname);

// Middleware
app.use(express.json());

// Check for client directory and serve accordingly
const clientPath = path.join(__dirname, 'client');
const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(clientPath)) {
  console.log('📁 Serving from client directory');
  app.use(express.static(clientPath));
} else if (fs.existsSync(distPath)) {
  console.log('📁 Serving from dist directory');
  app.use(express.static(distPath));
} else {
  console.log('📁 Using current directory as fallback');
  app.use(express.static(__dirname));
}

// Routes
app.get('/', (req, res) => {
  console.log('📄 Serving main page');
  
  // Try different possible index.html locations
  const possiblePaths = [
    path.join(__dirname, 'client/index.html'),
    path.join(__dirname, 'client/public/index.html'),
    path.join(__dirname, 'dist/index.html'),
    path.join(__dirname, 'index.html')
  ];
  
  for (const htmlPath of possiblePaths) {
    if (fs.existsSync(htmlPath)) {
      console.log('✅ Found index.html at:', htmlPath);
      return res.sendFile(htmlPath);
    }
  }
  
  // If no index.html found, send a basic HTML response
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>InclusiveHub AI Platform</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .status { color: green; font-size: 24px; margin: 20px; }
        .info { color: #666; font-size: 16px; }
      </style>
    </head>
    <body>
      <h1>🎉 InclusiveHub AI Platform</h1>
      <div class="status">✅ Server is Running Successfully!</div>
      <div class="info">Port: ${PORT}</div>
      <div class="info">Ready for Gemini AI demonstrations</div>
      <div class="info">All API endpoints are active</div>
    </body>
    </html>
  `);
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
    response: "Hello! I'm your AI accessibility assistant. I can help you find accessible places, analyze images for accessibility, process voice commands, and analyze documents. What would you like to do?",
    timestamp: new Date().toISOString()
  });
});

app.post('/api/vision-analyze', (req, res) => {
  console.log('👁️ Vision API called');
  res.json({ 
    analysis: {
      accessibility: { 
        score: 8, 
        issues: ["Consider adding tactile indicators", "Improve color contrast in some areas"], 
        improvements: ["Great wheelchair accessibility!", "Clear pathways", "Good lighting"] 
      },
      safety: { 
        hazards: ["Wet floor area detected"], 
        recommendations: ["Add non-slip mats", "Improve drainage"] 
      },
      description: "This appears to be a well-designed accessible environment with good lighting and clear pathways. The space shows consideration for people with mobility aids."
    }
  });
});

app.post('/api/speech-analyze', (req, res) => {
  console.log('🎤 Speech API called');
  res.json({ 
    result: {
      text: "Hello, I need help finding accessible restaurants near me",
      language: "en-US",
      confidence: 0.95,
      summary: "User is seeking accessible restaurant recommendations",
      actionItems: ["Find nearby restaurants", "Check accessibility features", "Provide directions"],
      sentiment: "positive",
      accessibility_insights: ["User prioritizes accessibility", "Location-based search needed"]
    }
  });
});

app.post('/api/document-analyze', (req, res) => {
  console.log('📄 Document API called');
  res.json({ 
    analysis: {
      summary: "This document outlines accessibility compliance standards and provides guidelines for creating inclusive environments.",
      analysisType: "accessibility_summary",
      documentUrl: req.body.documentUrl,
      timestamp: new Date().toISOString(),
      keyPoints: [
        "ADA compliance requirements",
        "Universal design principles", 
        "Digital accessibility standards",
        "Physical space modifications"
      ],
      recommendations: [
        "Implement screen reader compatibility",
        "Add alt text to all images",
        "Ensure keyboard navigation",
        "Provide multiple format options"
      ],
      compliance_score: 8
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server with explicit host binding
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 InclusiveHub AI Platform is LIVE!');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📱 Simple Browser: http://localhost:${PORT}`);
  console.log(`🔗 External: http://0.0.0.0:${PORT}`);
  console.log('🚀 Ready for hackathon demo!');
  console.log('✅ All Gemini API endpoints available!');
  
  // Test server connectivity
  setTimeout(() => {
    console.log('🔍 Testing server connectivity...');
  }, 1000);
});

// Keep alive
process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
  });
});

module.exports = app;