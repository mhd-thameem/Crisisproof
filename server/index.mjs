import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai'; // CORRECT CLASS NAME
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- THE FIX ---
// We initialize with the STABLE class and use the STABLE model name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" // Removed '-latest' and '3.1' to avoid v1beta 404s
});

const SAMPLE_HEADLINES = [
  "Iran-Israel tensions threaten crude oil supply",
  "Port congestion in Mundra delays electronics imports",
  "Red Sea shipping disruptions spike logistics costs"
];

// --- DASHBOARD FEED ---
app.get('/analyze-feed', async (req, res) => {
  console.log("🛰️  Scanning with Gemini 1.5 Flash...");
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      // We force the response to be JSON-friendly
      const prompt = `Analyze this supply chain risk: "${headline}". 
      Return ONLY a valid JSON object: {"isRisk":true, "commodity":"fuel", "severity":"high", "logic":"reason", "impactedPort":"string", "confidence":0.9}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Safety: Extract the JSON part in case the AI adds chatter
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      
      results.push({ 
        headline, 
        analysis: JSON.parse(cleanJson),
        timestamp: new Date().toISOString()
      });
      
      // Delay to avoid Rate Limits
      await new Promise(r => setTimeout(r, 2000)); 
    }
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("❌ BACKEND ERROR:", error.message);
    res.status(500).json({ success: false, error: "API Version Mismatch", details: error.message });
  }
});

app.get('/', (req, res) => res.json({ status: "online", engine: "CrisisProof 1.0.6" }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CrisisProof Live on Port ${PORT}`);
});
