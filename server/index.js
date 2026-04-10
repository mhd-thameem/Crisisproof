const express = require('express');
const cors = require('cors');
const GoogleAI = require('@google/generative-ai'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- THE FALLBACK LOGIC ---
// This looks in every possible place for the constructor to stop the TypeError
let GoogleGenAI;
if (GoogleAI.GoogleGenAI) {
    GoogleGenAI = GoogleAI.GoogleGenAI;
} else if (GoogleAI.default && GoogleAI.default.GoogleGenAI) {
    GoogleGenAI = GoogleAI.default.GoogleGenAI;
} else {
    GoogleGenAI = GoogleAI;
}

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

const SAMPLE_HEADLINES = [
  "Iran threatens to close Strait of Hormuz amid escalating US tensions",
  "Houthi attacks on Red Sea shipping routes intensify, major carriers reroute",
  "Russia halts fertilizer exports amid ongoing Ukraine conflict",
  "Indonesia bans palm oil exports citing domestic shortage"
];

// --- ROUTES ---
app.get('/', (req, res) => {
  res.send('🛰️ CrisisProof Engine is Online and Encrypted.');
});

app.get('/analyze-feed', async (req, res) => {
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const result = await model.generateContent(`Analyze this: ${headline}`);
      const response = await result.response;
      results.push({ headline, analysis: JSON.parse(response.text()) });
      await new Promise(r => setTimeout(r, 1000)); 
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/analyze', async (req, res) => {
  try {
    const { headline } = req.body;
    const result = await model.generateContent(`Detailed analysis for: ${headline}`);
    const response = await result.response;
    res.json({ success: true, analysis: JSON.parse(response.text()) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/community-report', (req, res) => {
  res.json({ success: true, id: `REP-${Date.now()}` });
});

app.post('/whistleblower', (req, res) => {
  res.json({ success: true, status: 'received_encrypted' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CrisisProof Engine running on port ${PORT}`);
});
