import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// --- 1. INITIALIZATION ---
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- 2. GOOGLE AI CONFIGURATION ---
// Using the model that produced the 503 (confirming it is live on the v1beta endpoint)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite-preview" 
});

// --- 3. MOCK DATABASE (For Hackathon Demo) ---
const SAMPLE_HEADLINES = [
  "Iran-Israel tensions threaten regional LPG shipping routes",
  "Major port labor strike in Mundra leads to logistics backlog",
  "Red Sea instability forcing tankers into expensive re-routing",
  "Unprecedented heatwave in North India spikes demand for cooling energy",
  "Sudden palm oil export ban from Indonesia impacts local edible oil prices"
];

let communityReports = [];

// --- 4. API ROUTES ---

// A. Health Check & Status
app.get('/', (req, res) => {
  res.json({ 
    status: "online", 
    engine: "CrisisProof-Alpha", 
    encryption: "AES-256-Simulated" 
  });
});

// B. Deep Analysis Dashboard (GET)
app.get('/analyze-feed', async (req, res) => {
  console.log("🛰️ Initiating Deep Logic Scan...");
  try {
    const results = [];
    
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `
        Act as a Senior Supply Chain Risk Analyst.
        Evaluate this event for the Indian market: "${headline}"
        Output ONLY a JSON object:
        {
          "isRisk": true,
          "commodity": "fuel/food/medicine",
          "severity": "low/medium/high",
          "logic": "Butterfly effect in under 15 words",
          "impactedPort": "Primary port name",
          "confidence": 0.95
        }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Safety: Extract only the JSON portion from the AI response
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      const cleanJson = responseText.substring(jsonStart, jsonEnd);

      results.push({
        headline,
        analysis: JSON.parse(cleanJson),
        timestamp: new Date().toISOString()
      });

      // 3-second delay to respect Free Tier rate limits and prevent 503s
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("❌ Analysis Failure:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "AI Pipeline Saturated", 
      details: error.message 
    });
  }
});

// C. Community Intelligence (POST/GET)
app.post('/community-report', (req, res) => {
  const { report, region, commodity, severity } = req.body;
  const newReport = {
    id: `SIG-${Math.random().toString(36).toUpperCase().substring(7)}`,
    report,
    region,
    commodity,
    severity: severity || "medium",
    timestamp: new Date().toISOString()
  };
  communityReports.push(newReport);
  res.status(201).json({ success: true, report: newReport });
});

app.get('/community-reports', (req, res) => {
  res.json({ success: true, reports: communityReports });
});

// D. Whistleblower Secure Gateway (POST)
app.post('/whistleblower', (req, res) => {
  const { category, description } = req.body;
  // Simulation: Logs the hit but keeps data behind a mock "encryption" layer
  console.log(`[ALERT] Secure signal received in category: ${category}`);
  res.json({ 
    success: true, 
    status: "Case Encrypted & Queued", 
    caseID: `WB-SECURE-${Date.now()}` 
  });
});

// --- 5. SERVER BINDING ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ==========================================
  🚀 CRISISPROOF BACKEND: ONLINE
  📍 Port: ${PORT}
  🤖 Model: Gemini 3.1 Flash Lite Preview
  ==========================================
  `);
});
