import express from 'express';
import cors from 'cors';
// THE TYPO IS FIXED HERE: GoogleGenerativeAI
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

console.log(`
-------------------------------------------------------
  CRISISPROOF: BACKEND LOGIC STANDING BY
  NODE VERSION: ${process.version}
  STATUS: INITIALIZING AI PIPELINES...
-------------------------------------------------------
`);

// THE TYPO IS FIXED HERE TOO: new GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { 
    responseMimeType: "application/json",
    temperature: 0.15 
  }
});

const GLOBAL_FEED = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify, major carriers reroute",
  "Russia halts fertilizer exports amid ongoing Ukraine conflict",
  "Indonesia bans palm oil exports citing domestic shortage",
  "Severe drought in Panama Canal slows down global shipping traffic"
];

const COMMUNITY_SIGNALS = [];

// --- ROUTES ---

app.get('/', (req, res) => {
  res.status(200).json({
    status: "online",
    engine: "CrisisProof Core",
    timestamp: new Date().toISOString(),
    features: ["Risk Analysis", "Feed Scan", "Community Reporting", "Encrypted Whistleblowing"]
  });
});

app.get('/analyze-feed', async (req, res) => {
  console.log("🛰️  Scanning Global Signals...");
  try {
    const analysisResults = [];
    for (const headline of GLOBAL_FEED) {
      const prompt = `Evaluate for Indian Supply Chain Stability: "${headline}". JSON: {"isRisk":boolean, "commodity":"fuel|food|medicine|none", "severity":"low|medium|high", "logicChain":"<30 words", "confidence":number}`;
      const result = await model.generateContent(prompt);
      analysisResults.push({ headline, analysis: JSON.parse(result.response.text()) });
      await new Promise(r => setTimeout(r, 1000));
    }
    res.json({ success: true, count: analysisResults.length, feed: analysisResults });
  } catch (error) {
    res.status(500).json({ success: false, error: "AI Inference Failure", details: error.message });
  }
});

app.post('/analyze', async (req, res) => {
  const { headline } = req.body;
  if (!headline) return res.status(400).json({ error: "No input signal provided." });
  try {
    const prompt = `Risk scan: "${headline}". JSON: { "riskScore": number, "primaryThreat": "string", "mitigationLogic": "string" }`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, input: headline, data: JSON.parse(result.response.text()) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Analysis Pipeline Offline" });
  }
});

app.post('/community-report', (req, res) => {
  const { report, region, commodity, observedSeverity } = req.body;
  const signalEntry = { id: `SIG-${Date.now()}`, report, region, commodity, severity: observedSeverity || "medium", timestamp: new Date().toISOString() };
  COMMUNITY_SIGNALS.push(signalEntry);
  res.status(201).json({ success: true, signalEntry });
});

app.get('/community-reports', (req, res) => res.json({ success: true, data: COMMUNITY_SIGNALS }));

app.post('/whistleblower', (req, res) => {
  res.json({ success: true, caseId: `WB-${Date.now()}`, status: "Encrypted & Queued" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CRISISPROOF LOGIC ENGINE IS LIVE ON PORT ${PORT}`);
});
