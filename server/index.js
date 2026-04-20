const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // High-performance logging
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// --- 1. MIDDLEWARE & LOGGING ---
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logs every request time to the console

// --- 2. ENVIRONMENT VALIDATION ---
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing!");
  process.exit(1);
}

// --- 3. AI CONFIGURATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: { responseMimeType: "application/json" } // Force JSON mode
});

// --- 4. THE HEARTBEAT (The "Home Door") ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online", 
    system: "CrisisProof Intelligence Engine",
    version: "1.1.0",
    engine: "Gemini 3.1 Flash Lite",
    uptime: process.uptime().toFixed(0) + "s"
  });
});

// --- 5. THE SIGNAL DECRYPTION (Single Headline) ---
app.post('/analyze', async (req, res) => {
  const { headline } = req.body;
  if (!headline) return res.status(400).json({ error: "Headline required" });

  console.log(`📡 Decrypting Signal: ${headline.substring(0, 30)}...`);

  try {
    const prompt = `
      Role: Expert Geopolitical Supply Chain Analyst.
      Task: Analyze disruption to India's essential commodities.
      Signal: "${headline}"
      Constraints: Return ONLY a raw JSON object. No markdown. No backticks.
      Schema: {
        "isRisk": boolean,
        "commodity": "LPG" | "fuel" | "food" | "medicine" | "none",
        "severity": "low" | "medium" | "high",
        "affectedRegions": string[],
        "timeline": "immediate" | "1-2 weeks" | "3-4 weeks",
        "confidence": number,
        "reason": "max 20 words",
        "recommendedAction": "max 15 words"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Safety check for JSON parsing
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const analysis = JSON.parse(cleanJson);

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("⚠️ AI Logic Error:", error.message);
    res.status(500).json({ success: false, error: "Intelligence Pipeline Error" });
  }
});

// --- 6. THE GLOBAL RISK STREAM (Live Feed) ---
app.post('/analyze-feed', async (req, res) => {
  try {
    const SAMPLE_HEADLINES = [
      "Iran threatens to close Strait of Hormuz amid escalating US tensions",
      "Major port strike in Mundra leads to logistics backlog",
      "Red Sea instability forcing tankers into expensive re-routing",
      "Indonesia bans palm oil exports citing domestic shortage"
    ];

    console.log("🌊 Refreshing Global Risk Stream...");
    const results = [];

    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `Supply Chain Scan: "${headline}". Return JSON only.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      results.push({ headline, analysis: JSON.parse(cleanJson) });
      
      // Delay to avoid hitting free-tier rate limits
      await new Promise(r => setTimeout(r, 1000));
    }

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: "Feed Update Failed" });
  }
});

// --- 7. FALLBACKS ---
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// --- 8. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  =========================================
  🚀 CrisisProof Engine LIVE
  📍 Port: ${PORT}
  🧠 Model: Gemini 3.1 Flash Lite
  =========================================
  `);
});
