const express = require('express');
const cors = require('cors');
// 1. Grab the WHOLE library
const GoogleAI = require('@google/generative-ai'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 2. THE NUCLEAR FIX:
// If it's a named export, use it. If it's tucked inside 'default', use that.
const GoogleGenAIClass = GoogleAI.GoogleGenAI || (GoogleAI.default ? GoogleAI.default.GoogleGenAI : GoogleAI);
const genAI = new GoogleGenAIClass(process.env.GEMINI_API_KEY);

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

// 3. Health Check
app.get('/', (req, res) => {
  res.send('🛰️ CrisisProof Engine is Online and Encrypted.');
});

// 4. Feed Route (The one you're testing)
app.get('/analyze-feed', async (req, res) => {
  try {
    const results = [];
    for (const headline of SAMPLE_HEADLINES) {
      const prompt = `Quick supply chain risk JSON for: ${headline}`;
      const result = await model.generateContent(prompt);
      results.push({ headline, analysis: JSON.parse(result.response.text()) });
      await new Promise(r => setTimeout(r, 1000)); 
    }
    res.json({ success: true, results });
  } catch (error) {
    console.error("Feed Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Full Feature Set (Keeping your other routes)
app.post('/analyze', async (req, res) => {
  try {
    const { headline } = req.body;
    const prompt = `Analyze: ${headline}`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, analysis: JSON.parse(result.response.text()) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CrisisProof Engine running on port ${PORT}`);
});