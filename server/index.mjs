import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// 1. IMPORTANT: Keep this open so Vercel can talk to you
app.use(cors());
app.use(express.json());

// 2. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 3. Your News Data
const GLOBAL_FEED = [
  "Strait of Hormuz tension spikes oil transit risks",
  "Port strike in Mundra delays electronics shipments",
  "Semiconductor shortage hits Maharashtra automotive hub"
];

// 4. The "Safe" Route (Fixed for 429 errors)
app.get('/analyze-feed', async (req, res) => {
  console.log("🛰️  Starting Global Scan...");
  try {
    const analysisResults = [];
    
    // We only scan 2 items to stay under the 15-request-per-minute limit
    for (const headline of GLOBAL_FEED.slice(0, 2)) {
      const prompt = `Quick supply chain risk scan for: "${headline}". Respond in 1 sentence of pure JSON logic: {"isRisk":true, "severity":"high", "impact":"brief description"}`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      analysisResults.push({ headline, analysis: JSON.parse(text) });
      
      // Wait 4 seconds between requests to be safe
      await new Promise(r => setTimeout(r, 4000));
    }

    res.json({ success: true, feed: analysisResults });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ success: false, error: "AI logic failed" });
  }
});

// 5. Basic Health Check
app.get('/', (req, res) => res.send("CrisisProof Backend is ONLINE"));

// 6. Start the Engine
app.listen(port, () => {
  console.log(`🚀 Server screaming at http://localhost:${port}`);
});
