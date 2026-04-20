const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// UPDATED MODEL
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

app.post('/analyze', async (req, res) => {
  try {
    const { headline } = req.body;
    const prompt = `Supply Chain Intelligence. Analyze: "${headline}". Return ONLY JSON: {"isRisk":true,"commodity":"LPG","severity":"high","affectedRegions":["Maharashtra"],"timeline":"3-4 weeks","confidence":98,"reason":"brief text","recommendedAction":"brief text"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // BULLETPROOF JSON CLEANER
    const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    res.json({ success: true, analysis: JSON.parse(cleanJson) });
  } catch (error) {
    res.status(500).json({ success: false, error: "AI logic failure" });
  }
});

app.post('/analyze-feed', async (req, res) => {
  try {
    const results = [];
    const SAMPLE_HEADLINES = ["Iran threats to close Strait of Hormuz", "Red Sea shipping reroutes", "Indonesia palm oil ban"];
    for (const headline of SAMPLE_HEADLINES) {
      const result = await model.generateContent(`Risk scan: "${headline}". JSON only.`);
      const text = result.response.text();
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      results.push({ headline, analysis: JSON.parse(cleanJson) });
      await new Promise(r => setTimeout(r, 1000)); // Rate limit protection
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CrisisProof Engine: Gemini 3.1 Active`));
