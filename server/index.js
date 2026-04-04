const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SAMPLE_HEADLINES = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify, major carriers reroute",
  "Russia halts fertilizer exports amid ongoing Ukraine conflict",
  "Indonesia bans palm oil exports citing domestic shortage",
  "India crude oil imports drop 15% as Middle East tensions escalate",
  "Suez Canal disruption forces ships to reroute around Africa adding 2 weeks",
  "Ukraine conflict disrupts global sunflower oil supply chain",
  "Saudi Arabia cuts oil production by 1 million barrels per day"
];

app.post('/analyze', async (req, res) => {
  try {
    const { headline } = req.body;
    const prompt = `You are a supply chain expert analyzing risks to India's essential commodity supply chain.

Analyze this headline: "${headline}"

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "isRisk": true,
  "commodity": "LPG",
  "severity": "high",
  "affectedRegions": ["Maharashtra", "Gujarat", "Karnataka"],
  "timeline": "3-4 weeks",
  "confidence": 85,
  "reason": "brief explanation under 20 words",
  "recommendedAction": "brief action under 15 words"
}

Rules:
- commodity must be one of: LPG, edible oil, fertilizer, fuel, medicine, none
- severity must be: low, medium, high
- affectedRegions must be real Indian states
- confidence is 0-100
- if no risk, set isRisk to false and severity to low`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(text);
    res.json({ success: true, headline, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/analyze-feed', async (req, res) => {
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES.slice(0, 4)) {
      const prompt = `You are a supply chain expert analyzing risks to India's essential commodity supply chain.
Analyze: "${headline}"
Respond ONLY with valid JSON:
{"isRisk":true,"commodity":"LPG","severity":"high","affectedRegions":["Maharashtra","Gujarat"],"timeline":"3-4 weeks","confidence":85,"reason":"brief reason","recommendedAction":"brief action"}
commodity options: LPG, edible oil, fertilizer, fuel, medicine, none
severity options: low, medium, high`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      let text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const analysis = JSON.parse(text);
      results.push({ headline, analysis });
      await new Promise(r => setTimeout(r, 1000));
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/community-report', async (req, res) => {
  try {
    const { report, region, commodity } = req.body;
    res.json({ success: true, id: Date.now(), report, region, commodity, upvotes: 0, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/whistleblower', async (req, res) => {
  try {
    const { category, description } = req.body;
    res.json({ success: true, id: Date.now(), category, status: 'received', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log('CrisisProof backend running on port 5000'));