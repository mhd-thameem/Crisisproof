const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/analyze', async (req, res) => {
  const { headline } = req.body;

  const prompt = `You are a supply chain expert. Analyze this news headline and determine if it poses a risk to India's LPG or essential commodity supply chain.

Headline: "${headline}"

Respond in this exact JSON format:
{
  "isRisk": true or false,
  "commodity": "LPG or edible oil or fertilizer or none",
  "severity": "low or medium or high",
  "timeline": "how many weeks before India feels the impact",
  "confidence": "percentage 0-100",
  "reason": "brief explanation"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash-latest',
    contents: prompt,
  });

  res.json({ analysis: response.text });
});

app.listen(5000, () => {
  console.log('CrisisProof backend running on port 5000');
});