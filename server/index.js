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
  "Indonesia bans palm oil exports citing domestic shortage"
];

// 1. Health Check (To avoid "Cannot GET /")
app.get('/', (req, res) => {
  res.send('🛰️ CrisisProof Engine is Online and Encrypted.');
});

app.post('/analyze', async (req, res) => {
  try {
    const { headline } = req.body;
    if (!headline) return res.status(400).json({ success: false, error: "Missing headline" });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview', 
      contents: [{ role: 'user', parts: [{ text: `
        Analyze this supply chain risk for India: "${headline}"
        Respond ONLY with a JSON object:
        {
          "isRisk": boolean,
          "commodity": "LPG" | "edible oil" | "fertilizer" | "fuel" | "medicine" | "none",
          "severity": "low" | "medium" | "high",
          "affectedRegions": ["StateName"],
          "timeline": "string",
          "confidence": number,
          "reason": "under 20 words",
          "recommendedAction": "under 15 words"
        }
      `}]}],
      config: { responseMimeType: 'application/json' }
    });

    const analysis = JSON.parse(response.text);
    res.json({ success: true, headline, analysis });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. CHANGED TO GET (So you can open it in browser)
app.get('/analyze-feed', async (req, res) => {
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: [{ role: 'user', parts: [{ text: `Quick supply chain risk JSON for: ${headline}` }] }],
        config: { responseMimeType: 'application/json' }
      });
      
      results.push({ headline, analysis: JSON.parse(response.text) });
      await new Promise(r => setTimeout(r, 500));
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Community and Whistleblower routes
app.post('/community-report', (req, res) => {
  const { report, region, commodity } = req.body;
  res.json({ success: true, id: Date.now(), report, region, commodity, upvotes: 0, timestamp: new Date().toISOString() });
});

app.post('/whistleblower', (req, res) => {
  const { category, description } = req.body;
  res.json({ success: true, id: Date.now(), category, status: 'received', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CrisisProof Engine running on port ${PORT}`);
});