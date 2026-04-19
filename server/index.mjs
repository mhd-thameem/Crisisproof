import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai'; // FIXED: Correct class name
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- INITIALIZE GOOGLE AI ---
// Using "gemini-1.5-flash-latest" to bypass the v1beta 404 error
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest", // FIXED: "latest" alias is most stable
  generationConfig: { 
    responseMimeType: "application/json",
    temperature: 0.1 
  }
});

const SAMPLE_HEADLINES = [
  "Iran-Israel tensions threaten crude oil supply to India",
  "Port congestion in Mundra delays electronics imports",
  "Red Sea shipping disruptions spike logistics costs"
];

const COMMUNITY_REPORTS = [];

app.get('/', (req, res) => res.json({ status: "online", engine: "CrisisProof 1.0.5" }));

// --- DASHBOARD FEED ---
app.get('/analyze-feed', async (req, res) => {
  console.log("🛰️  Starting Optimized Scan...");
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `Perform a supply chain risk analysis for India: "${headline}".
      Output ONLY a JSON object with this exact structure:
      {"isRisk":true, "commodity":"name", "severity":"high/medium/low", "logic":"short reason", "impactedPort":"string", "confidence":0.95}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Safety: Extract JSON even if AI adds extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        results.push({ 
          headline, 
          analysis: JSON.parse(jsonMatch[0]),
          timestamp: new Date().toISOString()
        });
      }
      
      // 3-second delay to stay well within free-tier limits
      await new Promise(r => setTimeout(r, 3000)); 
    }
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("❌ BACKEND ERROR:", error.message);
    res.status(500).json({ success: false, error: "AI Pipeline Offline", details: error.message });
  }
});

// --- COMMUNITY FEED ---
app.get('/community-reports', (req, res) => res.json({ success: true, reports: COMMUNITY_REPORTS }));

app.post('/community-report', (req, res) => {
  const { report, region, commodity } = req.body;
  const newReport = { id: Date.now(), report, region, commodity, timestamp: new Date() };
  COMMUNITY_REPORTS.push(newReport);
  res.json({ success: true, report: newReport });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 System active on port ${PORT}`));
