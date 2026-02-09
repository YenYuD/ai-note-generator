# Gemini Transcript Note Generator 📝

這是一個簡單而強大的工具，利用 Google Gemini API 將繁雜的逐字稿自動轉化為結構清晰、重點明確的 Markdown 筆記。特別適合用於整理 Udemy 課程、會議記錄或演講內容。

## ✨ 功能特色

- **AI 智能摘要**：利用 Google Gemini 模型深入分析文本，提取關鍵資訊。
- **結構化輸出**：自動生成包含重點摘要、程式碼區塊 (SQL/Code) 的 Markdown 格式。
- **即時預覽**：生成後直接在網頁上渲染 Markdown 結果，所見即所得。
- **一鍵下載**：支援將結果匯出為 `.md` 檔案，完美整合 Obsidian、Notion 等筆記軟體。
- **現代化介面**：深色模式 (Dark Mode) 設計，閱讀舒適，支援響應式排版。

## 🚀 快速開始

### 1. 取得 Google API Key
請前往 [Google AI Studio](https://aistudio.google.com/) 申請免費的 API Key。

### 2. 環境設定
本專案使用 Node.js 開發。請確保您的電腦已安裝 Node.js。

1. **複製專案**
   ```bash
   git clone <your-repo-url>
   cd gemini-transcript
   ```

2. **安裝套件**
   ```bash
   npm install
   ```

3. **設定環境變數**
   在專案根目錄建立 `.env` 檔案，並填入您的 API Key：
   ```env
   GOOGLE_API_KEY=你的_API_KEY_這裡
   # PORT=3000 (可選，預設為 3000)
   ```

4. **啟動伺服器**
   ```bash
   npm start
   ```
   瀏覽器打開 `http://localhost:3000` 即可使用。

## ☁️ 部署至雲端 (Deploy)

本專案已優化，可直接部署至 Render, Heroku, 或 Railway 等平台。

### 部署步驟 (以 Render 為例)：
1. 將程式碼推送到 GitHub。
2. 在 Render 新增 "Web Service"。
3.連結此 GitHub Repository。
4. **Environment Variables** 設定：
    - Key: `GOOGLE_API_KEY`
    - Value: `(填入您的 API Key)`
5. 部署完成！

## 🛠️ 技術堆疊
- **Frontend**: HTML5, CSS3 (Modern/Glassmorphism), JavaScript (Vanilla), Marked.js
- **Backend**: Node.js, Express
- **AI**: Google Gemini API (`@google/genai`)

## 📝 授權
MIT License
