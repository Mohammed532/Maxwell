require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));

app.post('/api/analyze-circuit', async (req, res) => {
  console.log('Received request to analyze circuit');
//   console.log('Request body keys:', Object.keys(req.body));
  
  try {
    const response = await fetch(process.env.NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    console.log('NVIDIA API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }
    
    const data = await response.json();
    console.log('Success! Sending response back to client');
    res.json(data);
  } catch (error) {
    console.error('Server error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Ready to receive requests from React app');
});