const express = require('express');
const fs = require('fs');
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
const OBSIDIAN_PATH = process.env.OBSIDIAN_PATH;

async function callGeminiAndSave(title, transcript) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一個 SQL 專家。請根據這段 Udemy 逐字稿生成結構化的筆記。要求：使用 Markdown 格式、SQL 語法要用代碼塊、加入重點摘要。內容：${transcript}`
    });

    const result = response.candidates[0].content.parts[0].text;

    const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    fs.writeFileSync(path.join(OBSIDIAN_PATH, fileName), result);

    console.log(`筆記已存至 ${fileName}`);
    return fileName;
  } catch (error) {
    console.error(error.message);
  }
}

app.post('/generate-notes', async (req, res) => {
  const { title, transcript } = req.body;
  try {
    const fileName = await callGeminiAndSave(title, transcript);
    res.send({ status: 'success', message: `筆記已存至 ${fileName}` });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});