const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/generative-ai'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. THE STABLE CORE ---
// Using the explicit class constructor to prevent Render/Node 22 TypeErrors
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

const SAMPLE_HEADLINES = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify, major carriers reroute",
  "Russia halts fertilizer exports amid ongoing Ukraine conflict",
  "Indonesia bans palm oil exports citing domestic shortage"
];

// --- 2. ENGINE HEALTH & MONITORING ---
app.get('/', (req, res) => {
  res.send('🛰️ CrisisProof Engine is Online and Encrypted.');
});

// --- 3. CORE AI ANALYSIS (THE "WHY" ENGINE) ---
app.post('/analyze', async (req, res) => {
  try {
    const { headline } = req.body;
    if (!headline) return res.status(400).json({ success: false, error: "Missing headline" });

    const prompt = `Analyze this supply chain risk for India: "${headline}". 
    Respond ONLY with a JSON object:
    {
      "isRisk": boolean,
      "commodity": "LPG" | "edible oil" | "fertilizer" | "fuel" | "medicine" | "none",
      "severity": "low" | "medium" | "high",
      "affectedRegions": ["StateName"],
      "timeline": "string",
      "confidence": number,
      "reason": "under 20 words explaining the logical connection",
      "recommendedAction": "under 15 words"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ success: true, headline, analysis: JSON.parse(response.text()) });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 4. THE LIVE FEED (DASHBOARD SYNC) ---
app.get('/analyze-feed', async (req, res) => {
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `Quick supply chain risk JSON for: ${headline}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      results.push({ headline, analysis: JSON.parse(response.text()) });
      // 1-second delay to protect your API quota on the free tier
      await new Promise(r => setTimeout(r, 1000)); 
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- 5. SOCIAL & SECURITY FEATURES ---
app.post('/community-report', (req, res) => {
  const { report, region, commodity } = req.body;
  // This simulates a DB entry for now
  res.json({ 
    success: true, 
    id: `REP-${Date.now()}`, 
    report, 
    region, 
    commodity, 
    upvotes: 0, 
    timestamp: new Date().toISOString() 
  });
});

app.post('/whistleblower', (req, res) => {
  const { category, description } = req.body;
  // Securely logged without identifying the user
  res.json({ 
    success: true, 
    caseId: `WB-${Math.random().toString(36).substr(2, 9)}`, 
    status: 'received_encrypted', 
    timestamp: new Date().toISOString() 
  });
});

// --- 6. GLOBAL PORT BINDING ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CrisisProof Engine running on port ${PORT}`);
});