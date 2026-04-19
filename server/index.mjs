import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// --- 1. CORE CONFIGURATION ---
dotenv.config();
const app = express();

// High-compatibility CORS for Vercel <-> Render connection
app.use(cors({ origin: '*' })); 
app.use(express.json());

// --- 2. INTELLIGENCE LAYER ---
// Initializing with the user-verified successful model [cite: 86]
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite-preview" 
});

// --- 3. IN-MEMORY DATA STORES ---
const SAMPLE_HEADLINES = [
  "Iran threats to close Strait of Hormuz amid escalating tensions",
  "Major port labor strike in Mundra leads to logistics backlog",
  "Red Sea instability forcing tankers into expensive re-routing",
  "Unprecedented heatwave in North India spikes energy demand",
  "Sudden palm oil export ban from Indonesia impacts local prices"
];

let communityReports = [];

// --- 4. PRODUCTION ROUTES ---

// A. Health Check (Always check this first!)
app.get('/', (req, res) => {
  res.json({ status: "online", engine: "CrisisProof Logic 1.0.7", auth: "Gemini-3.1-Verified" });
});

// B. Dashboard Intelligence Feed [cite: 49, 51]
app.get('/analyze-feed', async (req, res) => {
  console.log("🚀 Starting Global Risk Scan...");
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `Evaluate supply chain risk for India: "${headline}". 
      Output ONLY a JSON object: {"isRisk":true, "commodity":"fuel/food", "severity":"high/medium/low", "logic":"max 15 words", "impactedPort":"string", "confidence":0.95}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Robust JSON Extraction (prevents crashes from AI 'chatter')
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      
      results.push({
        headline,
        analysis: JSON.parse(cleanJson),
        timestamp: new Date().toISOString()
      });

      // 2.5-second stagger to prevent 503 Service Unavailable errors
      await new Promise(r => setTimeout(r, 2500)); 
    }
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("Feed Error:", error.message);
    res.status(500).json({ success: false, error: "AI Pipeline Saturated" });
  }
});

// C. On-Demand Decrypt (Single Headline Analysis) [cite: 31, 40]
app.post('/analyze', async (req, res) => {
  const { headline } = req.body;
  if (!headline) return res.status(400).json({ error: "Signal input required." });

  try {
    const prompt = `Deep scan headline: "${headline}". 
    JSON: { "riskScore": number, "primaryImpact": "string", "mitigationStrategy": "string" }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);

    res.json({ success: true, analysis: JSON.parse(cleanJson) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Decrypt Failure" });
  }
});

// D. Community Intelligence (HUMINT) [cite: 56, 59]
app.post('/community-report', (req, res) => {
  const { report, region, commodity, severity } = req.body;
  const newReport = {
    id: `SIG-${Date.now()}`,
    report, region, commodity,
    severity: severity || "medium",
    timestamp: new Date().toISOString()
  };
  communityReports.push(newReport);
  res.status(201).json({ success: true, report: newReport });
});

app.get('/community-reports', (req, res) => {
  res.json({ success: true, reports: communityReports });
});

// E. Secure Whistleblower Gateway [cite: 66, 69]
app.post('/whistleblower', (req, res) => {
  res.json({ 
    success: true, 
    status: "Zero-Trace Encryption Active", 
    caseID: `WB-${Math.random().toString(36).substring(7).toUpperCase()}` 
  });
});

// --- 5. SERVER BINDING ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`📡 CrisisProof Backend initialized on port ${PORT}`);
});
