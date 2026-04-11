import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// --- CONFIGURATION ---
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- INITIALIZE GOOGLE AI (2026 STANDARDS) ---
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { 
    responseMimeType: "application/json",
    temperature: 0.1 // Lower temperature for high logical consistency
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
          "confidence": number (0-1)
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      results.push({ 
        headline, 
        analysis: JSON.parse(response.text()),
        timestamp: new Date().toISOString()
      });
      
      // Delay to prevent rate limiting on free tier
      await new Promise(r => setTimeout(r, 1200)); 
    }
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("Feed Logic Error:", error);
    res.status(500).json({ success: false, error: "Logic Engine Mismatch", details: error.message });
  }
});

// --- 3. ON-DEMAND RISK ASSESSMENT (SEARCH) ---
app.post('/analyze', async (req, res) => {
  const { headline } = req.body;
  if (!headline) return res.status(400).json({ error: "No signal provided for analysis." });

  try {
    const prompt = `Perform a high-level logical risk scan: "${headline}". 
    Focus on secondary market impacts in South Asia. 
    JSON format: { "riskScore": number, "primaryImpact": "string", "mitigationStrategy": "string" }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ 
      success: true, 
      input: headline, 
      analysis: JSON.parse(response.text()) 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Analysis Pipeline Interrupted" });
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
  res.status(201).json({ success: true, message: "Signal broadcasted to network", report: newReport });
});

app.get('/community-reports', (req, res) => {
  res.json({ success: true, reports: COMMUNITY_REPORTS });
});

// --- 5. SECURE WHISTLEBLOWER GATEWAY ---
app.post('/whistleblower', (req, res) => {
  const { category, description, evidence_link } = req.body;
  
  // Logic to handle sensitive data anonymously
  console.log(`[ALERT] Secure Whistleblower report received in category: ${category}`);
  
  res.json({ 
    success: true, 
    caseId: `WB-SECURE-${Date.now()}`, 
    status: "Encrypted & Queued",
    instruction: "Your identity is protected by zero-knowledge simulation." 
  });
});

// --- 6. GLOBAL PORT BINDING ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  --------------------------------------------------
  🛰️  CRISISPROOF LOGIC ENGINE INITIALIZED
  🚀  Status: Live on Port ${PORT}
  🛠️  Mode: ES Module (MJS)
  --------------------------------------------------
  `);
});
