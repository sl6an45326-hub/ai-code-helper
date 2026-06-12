const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_API = process.env.OLLAMA_API || 'http://localhost:11434';
const MODEL = process.env.MODEL || 'llama2';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✅', timestamp: new Date() });
});

// Check Ollama Connection
app.get('/api/ollama/status', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_API}/api/tags`);
    res.json({
      status: 'Ollama is connected ✅',
      models: response.data.models || []
    });
  } catch (error) {
    res.status(500).json({
      status: 'Ollama is not connected ❌',
      error: error.message
    });
  }
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`📝 User: ${message}`);

    const response = await axios.post(
      `${OLLAMA_API}/api/generate`,
      {
        model: MODEL,
        prompt: message,
        stream: false
      }
    );

    const aiResponse = response.data.response || 'No response';
    console.log(`🤖 AI: ${aiResponse}`);

    res.json({
      success: true,
      message: message,
      response: aiResponse,
      model: MODEL,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get response from AI'
    });
  }
});

// Stream Chat Endpoint (for real-time responses)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    res.setHeader('Content-Type', 'application/json');

    const response = await axios.post(
      `${OLLAMA_API}/api/generate`,
      {
        model: MODEL,
        prompt: message,
        stream: true
      },
      { responseType: 'stream' }
    );

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(l => l.trim());
      lines.forEach(line => {
        try {
          const json = JSON.parse(line);
          res.write(JSON.stringify(json) + '\n');
        } catch (e) {
          console.error('Error parsing stream:', e);
        }
      });
    });

    response.data.on('end', () => {
      res.end();
    });

    response.data.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).json({ error: 'Stream error' });
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to stream response'
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 AI Code Helper Backend`);
  console.log(`📍 Server running at http://localhost:${PORT}`);
  console.log(`🧠 Ollama API: ${OLLAMA_API}`);
  console.log(`🤖 Model: ${MODEL}`);
  console.log(`\n✅ Ready to help!\n`);
});
