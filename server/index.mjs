import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-1.5-flash for the best balance of speed and stability
const model = genAI.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite-preview",
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
  ]
});

const GLOBAL_FEED = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify",
  "Severe drought in Panama Canal slows down global shipping traffic"
];

// This matches your React's fetch('https://crisisproof.onrender.com/analyze-feed')
app.get('/analyze-feed', async (req, res) => {
  console.log("🛰️  Satellite Link Established. Scanning Global Feed...");
  try {
    const analysisResults = [];

    for (const headline of GLOBAL_FEED) {
      const prompt = `Perform a supply chain risk analysis for India based on: "${headline}". 
      Respond ONLY with a JSON object. No extra text or markdown.
      Structure: {"isRisk":true, "commodity":"string", "severity":"high/medium/low", "timeline":"string", "reason":"string", "confidence":95, "affectedRegions":["State1", "State2"]}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // CLEANER: Find the JSON block even if Gemini adds markdown backticks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResults.push({ headline, analysis: JSON.parse(jsonMatch[0]) });
      }

      // Wait 3 seconds between items to avoid the 429 Rate Limit error
      await new Promise(r => setTimeout(r, 3000));
    }

    res.json({ success: true, feed: analysisResults });
  } catch (error) {
    console.error("❌ BACKEND ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => res.send("CrisisProof Intelligence Engine: ONLINE"));

app.listen(port, () => console.log(`🚀 System active on port ${port}`));
