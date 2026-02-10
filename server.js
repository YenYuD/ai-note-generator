import express from 'express';
import { GoogleGenAI } from "@google/genai";
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/dist')));

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


app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});