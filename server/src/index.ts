import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from "@google/genai";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.FRONTEND_PREVIEW_URL || 'http://localhost:4173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 10 minutes)
	message: 'Too many requests from this IP, please try again later.',
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || '',
});

const MODEL = process.env.MODEL || "gemini-2.5-flash-lite";

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
    const prompt = `
      You are an expert technical writer and study assistant. Your task is to process the following transcript and convert it into structured, high-quality learning notes.
      
      Objective:
      - Transform the spoken transcript into a clear, concise, and well-organized Markdown document.
      - The target audience is students or professionals learning from this lecture.
      - The output language must be: ${targetLanguage}.

      Structure Requirements:
      1. # ${title} (Title)
      2. ## Executive Summary
         - A concise 2-3 sentence overview of the main topic.
      3. ## Key Concepts
         - Bullet points defining the most important terms or ideas mentioned. 
         - Use **bold** text for key vocabulary.
      4. ## Detailed Examples & Walkthrough
         - Organize the transcript into logical sections with clear H3 (###) headings.
         - If specific steps or processes are described, use numbered lists.
         - **CRITICALLY IMPORTANT**: If any SQL code, programming logic, or command-line syntax is mentioned, you MUST extract it into proper code blocks (e.g., \`\`\`sql).
         - Explain the code snippets if the context provides an explanation.
      5. ## Key Takeaways
         - A brief summary of what the learner should remember.

      Formatting Rules:
      - Remove conversational filler (um, uh, you know, like) and redundancy.
      - Fix any obvious speech-to-text errors if the context is clear.
      - Use standard Markdown formatting (bold, italics, lists).
      
      Transcript Preview:
      ${transcript}
      `;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt
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