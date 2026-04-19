import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai'; // FIXED NAME
import dotenv from 'dotenv';

// --- CONFIGURATION ---
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- INITIALIZE GOOGLE AI (Corrected Class Name) ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // FIXED NAME
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { 
    responseMimeType: "application/json",
    temperature: 0.1 
  }
});

// Mock Database for the Hackathon Demo
const SAMPLE_HEADLINES = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify, major carriers reroute",
  "Russia halts fertilizer exports amid ongoing Ukraine conflict",
  "Indonesia bans palm oil exports citing domestic shortage",
  "Severe drought in Panama Canal slows down global shipping traffic"
];

const COMMUNITY_REPORTS = [];

// --- MIDDLEWARE: LOGGING ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// --- 1. BASE ENGINE ROUTE ---
app.get('/', (req, res) => {
  res.status(200).json({
    status: "online",
    engine: "CrisisProof 1.0.4",
    encryption: "AES-256-GCM Simulation",
    node_version: process.version
  });
});

// --- 2. DEEP ANALYSIS FEED (DASHBOARD) ---
app.get('/analyze-feed', async (req, res) => {
  console.log("🚀 Starting Deep Logic Scan...");
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `
        As a Supply Chain Analyst, evaluate this event for India: "${headline}".
        Output ONLY a JSON object with this structure:
        {
          "isRisk": boolean,
          "commodity": "fuel" | "food" | "medicine" | "tech" | "none",
          "severity": "low" | "medium" | "high",
          "logic": "under 25 words explaining the geopolitical butterfly effect",
          "impactedPort": "string",
          "confidence": number
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Safety check: ensure we only parse the JSON part
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        results.push({ 
          headline, 
          analysis: JSON.parse(jsonMatch[0]),
          timestamp: new Date().toISOString()
        });
      }
      
      await new Promise(r => setTimeout(r, 2000)); // 2s delay for free tier safety
    }
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("Feed Logic Error:", error);
    res.status(500).json({ success: false, error: "AI Pipeline Error", details: error.message });
  }
});

// --- 4. COMMUNITY SIGNALING (SOCIAL) ---
app.post('/community-report', (req, res) => {
  const { report, region, commodity, severity } = req.body;
  const newReport = {
    id: `SIG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    report,
    region,
    commodity,
    severity: severity || "medium",
    verified: false,
    timestamp: new Date().toISOString()
  };
  COMMUNITY_REPORTS.push(newReport);
  res.status(201).json({ success: true, message: "Signal broadcasted", report: newReport });
});

app.get('/community-reports', (req, res) => {
  res.json({ success: true, reports: COMMUNITY_REPORTS });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 System active on port ${PORT}`);
});
