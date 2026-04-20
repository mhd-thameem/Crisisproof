const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SAMPLE_HEADLINES = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify, major carriers reroute",
  "Russia halts fertilizer exports amid ongoing Ukraine conflict",
  "Indonesia bans palm oil exports citing domestic shortage",
];

app.post('/analyze', async (req, res) => {
  try {
    const { headline } = req.body;
    const prompt = `You are a supply chain expert analyzing risks to India's essential commodity supply chain.
Analyze this headline: "${headline}"
Respond ONLY with valid JSON, no markdown, no explanation:
{"isRisk":true,"commodity":"LPG","severity":"high","affectedRegions":["Maharashtra","Gujarat","Karnataka"],"timeline":"3-4 weeks","confidence":85,"reason":"brief explanation under 20 words","recommendedAction":"brief action under 15 words"}
Rules: commodity must be one of: LPG, edible oil, fertilizer, fuel, medicine, none. severity must be: low, medium, high. confidence is 0-100.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
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
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `You are a supply chain expert. Analyze: "${headline}"
Respond ONLY with valid JSON:
{"isRisk":true,"commodity":"LPG","severity":"high","affectedRegions":["Maharashtra","Gujarat"],"timeline":"3-4 weeks","confidence":85,"reason":"brief reason","recommendedAction":"brief action"}
commodity options: LPG, edible oil, fertilizer, fuel, medicine, none. severity: low, medium, high.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CrisisProof backend running on port ${PORT}`));
