const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = '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'; // Your actual API key

app.post('/api/perplexity', async (req, res) => {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("🧠 Perplexity Response:", JSON.stringify(data, null, 2));

    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('🟢 Proxy running on http://localhost:3001'));
