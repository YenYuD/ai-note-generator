const express = require('express');
const path = require('path');
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

async function callGemini(title, transcript) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `你是一個 SQL 專家。請根據這段 Udemy 逐字稿生成結構化的筆記。要求：使用 Markdown 格式、SQL 語法要用代碼塊、加入重點摘要。內容：${transcript}`
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
  const { title, transcript } = req.body;
  if (!title || !transcript) {
    return res.status(400).send({ status: 'error', message: 'Title and transcript are required' });
  }

  try {
    const { markdown, filename } = await callGemini(title, transcript);
    res.send({ status: 'success', markdown, filename });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});