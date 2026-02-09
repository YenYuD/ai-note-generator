const express = require('express');
const { GoogleGenAI } = require("@google/genai");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const MODEL = "gemini-2.5-flash-lite"

async function callGemini(title, transcript, targetLanguage) {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `You are a SQL expert. Please generate structured notes based on the following transcript. 
      Requirements: 
      1. Use Markdown format.
      2. Use code blocks for SQL syntax.
      3. Include a summary of key points.
      4. The output language must be: ${targetLanguage}.
      5. The title of the note is: ${title}.
      
      Transcript content: ${transcript}`
    });

    const result = response.candidates[0].content.parts[0].text;
    const filename = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;

    return { markdown: result, filename };
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
}

app.post('/generate-notes', async (req, res) => {
  const { title, transcript, language } = req.body;
  const targetLanguage = language || "English"; // Default to English if not provided

  if (!title || !transcript) {
    return res.status(400).send({ status: 'error', message: 'Title and transcript are required' });
  }

  try {
    const { markdown, filename } = await callGemini(title, transcript, targetLanguage);
    res.send({ status: 'success', markdown, filename });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});