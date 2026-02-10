# Gemini Transcript Note Generator 📝

This is a simple yet powerful tool that uses the Google Gemini API to convert lengthy transcripts into clear, structured Markdown notes. It features a modern React frontend with syntax highlighting and a robust Node.js backend.

## ✨ Features

- **AI-Powered Summarization**: Uses the Google Gemini model to deeply analyze text and extract key information.
- **Rich Markdown Rendering**: React-based frontend with `react-markdown` and `syntax-highlighter` for beautiful code blocks.
- **Structured Output**: Automatically generates Markdown suitable for notes, including key points and code blocks (e.g., SQL).
- **Customizable Language**: You can specify the output language (e.g., English, Traditional Chinese, Spanish).
- **Live Preview**: Renders the generated Markdown directly in the browser for immediate review.
- **One-Click Download**: Supports exporting the result as a `.md` file.
- **Modern UI**: Dark mode design with responsive layout and smooth animations.

## 🚀 Quick Start

### 1. Get Google API Key
Please visit [Google AI Studio](https://aistudio.google.com/) to get a free API Key.

### 2. Environment Setup
Ensure Node.js is installed on your computer.

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gemini-transcript
   ```

2. **Install dependencies**
   ```bash
   # Install backend deps
   npm install
   
   # Install frontend deps & build
   npm run build
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   # PORT=3000 (Optional)
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser.

### 🐞 Development Mode

To run the backend and frontend separately for development:

1. **Backend**: `npm run dev` (Runs on port 3000)
2. **Frontend**: `cd client && npm run dev` (Runs on port 5173, proxies to 3000)

## ☁️ Deploy to Cloud

This project is optimized for deployment on platforms like Render or Heroku.

### Deployment Steps (e.g., Render):
1. Push to GitHub.
2. Create a new "Web Service".
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add `GOOGLE_API_KEY`.
6. Deploy!

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TypeScript, React Markdown, Lucide React
- **Backend**: Node.js, Express
- **AI**: Google Gemini API (`@google/genai`)

## 📝 License
MIT License
