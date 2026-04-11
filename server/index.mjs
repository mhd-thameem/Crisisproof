import express from 'express';
import cors from 'cors';
import pkg from '@google/generative-ai'; // Import the whole package as 'pkg'
import dotenv from 'dotenv';

const { GoogleGenAI } = pkg; // Extract the tool from the package manually
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- THE CORE AI ENGINE ---
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { 
    responseMimeType: "application/json",
    temperature: 0.1 
  }
});

const SAMPLE_HEADLINES = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify, major carriers reroute",
  "Russia halts fertilizer exports amid ongoing Ukraine conflict",
  "Indonesia bans palm oil exports citing domestic shortage",
  "Severe drought in Panama Canal slows down global shipping traffic"
];

// --- ROUTES ---

app.get('/', (req, res) => {
  res.json({ status: "online", engine: "CrisisProof 1.0.5" });
});

app.get('/analyze-feed', async (req, res) => {
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `Analyze: "${headline}". JSON: {"isRisk": boolean, "commodity": "string", "severity": "string", "reason": "string"}`;
      const result = await model.generateContent(prompt);
      results.push({ headline, analysis: JSON.parse(result.response.text()) });
      await new Promise(r => setTimeout(r, 1000)); 
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Community and Whistleblower placeholders
app.post('/community-report', (req, res) => res.json({ success: true, id: Date.now() }));
app.post('/whistleblower', (req, res) => res.json({ success: true, status: 'received' }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CrisisProof Engine running on port ${PORT}`);
});
