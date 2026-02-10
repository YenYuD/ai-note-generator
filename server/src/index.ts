import express, { Request, Response } from 'express';
import { GoogleGenAI } from "@google/genai";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || '',
});

const MODEL = "gemini-2.5-flash-lite";

interface GenerateNotesRequest {
  title: string;
  transcript: string;
  language?: string;
}

interface GenerateNotesResponse {
  status: string;
  markdown?: string;
  filename?: string;
  message?: string;
}

async function callGemini(title: string, transcript: string, targetLanguage: string): Promise<{ markdown: string; filename: string }> {
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

    const result = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) {
        throw new Error("No content generated from Gemini.");
    }

    const filename = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;

    return { markdown: result, filename };
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
}

app.post('/generate-notes', async (req: Request<{}, {}, GenerateNotesRequest>, res: Response<GenerateNotesResponse>) => {
  const { title, transcript, language } = req.body;
  const targetLanguage = language || "English";

  if (!title || !transcript) {
    res.status(400).send({ status: 'error', message: 'Title and transcript are required' });
    return;
  }

  try {
    const { markdown, filename } = await callGemini(title, transcript, targetLanguage);
    res.send({ status: 'success', markdown, filename });
  } catch (error: any) {
    res.status(500).send({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});