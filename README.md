# Gemini Transcript Note Generator 📝

This is a simple yet powerful tool that uses the Google Gemini API to convert lengthy transcripts into clear, structured Markdown notes. It is especially suitable for organizing Udemy courses, meeting minutes, or speech content.

## ✨ Features

- **AI-Powered Summarization**: Uses the Google Gemini model to deeply analyze text and extract key information.
- **Structured Output**: Automatically generates Markdown suitable for notes, including key points and code blocks (e.g., SQL).
- **Customizable Language**: You can specify the output language (e.g., English, Traditional Chinese, Spanish).
- **Live Preview**: Renders the generated Markdown directly in the browser for immediate review.
- **One-Click Download**: Supports exporting the result as a `.md` file, perfect for Obsidian, Notion, or other note-taking apps.
- **Modern UI**: Dark mode design for a comfortable reading experience, fully responsive.

## 🚀 Quick Start

### 1. Get Google API Key
Please visit [Google AI Studio](https://aistudio.google.com/) to get a free API Key.

### 2. Environment Setup
This project is built with Node.js. Please ensure Node.js is installed on your computer.

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gemini-transcript
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API Key:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   # PORT=3000 (Optional, default is 3000)
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser.

## ☁️ Deploy to Cloud

This project is optimized for deployment on platforms like Render, Heroku, or Railway.

### Deployment Steps (e.g., Render):
1. Push the code to GitHub.
2. Create a new "Web Service" on Render.
3. Connect your GitHub Repository.
4. **Environment Variables** Setup:
    - Key: `GOOGLE_API_KEY`
    - Value: `(Your API Key)`
5. Deploy!

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Modern/Glassmorphism), JavaScript (Vanilla), Marked.js
- **Backend**: Node.js, Express
- **AI**: Google Gemini API (`@google/genai`)

## 📝 License
MIT License
