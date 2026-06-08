# 🚀 GitSpectra 📊

**GitSpectra** is an AI-powered full-stack web application that analyzes GitHub developer profiles and repositories to generate deep technical insights, developer scoring, and interactive visualizations.

Using the **Gemini API**, it transforms raw GitHub data into meaningful intelligence such as coding patterns, strengths, weaknesses, achievements, and technology trends.

---

## 🌐 Live Demo

🔗 https://gitspectra.onrender.com

> ⚠️ Note for Reviewers:  
This project is hosted on Render’s free tier. If it takes time to load, the server is waking up from sleep mode. Please wait ~1–2 minutes.

---

## ✨ Features

🤖 AI Developer Analysis  
Generates deep insights from GitHub profiles including strengths, weaknesses, and personalized recommendations using Gemini 3.5 Flash.

📈 Data Visualization Dashboard  
Interactive charts showing language distribution, activity trends, and repository popularity.

🏆 Gamified Achievement System  
Unlock badges based on developer behavior such as:
- Open Source Explorer
- Full Stack Builder
- Backend Specialist

🎯 Developer Scoring Engine  
Calculates a dynamic score based on repositories, language diversity, popularity, and consistency.  
Ranks developers from Beginner → Elite Developer.

🛡️ Secure & Scalable Architecture  
Built with TypeScript, secure environment variables, and production-ready backend design.

---

## 🛠️ Tech Stack

Frontend:
React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Recharts

Backend:
Node.js, Express, Google GenAI SDK (Gemini), ESBuild

---

## 📦 Installation & Setup
If you still want to run it locally:
git clone https://github.com/Ouissal-Hadji/GitSpectra.git
cd GitSpectra
npm install

Create .env file:

GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_personal_access_token_here

Run development server:

npm run dev

Open:
http://localhost:3000

---

## 🚀 Production Build

npm install && npm run build
npm run start

Backend is compiled into /dist/server.js

---

## 👩‍💻 Developer

Ouissal Hadji  
Software Engineering Student & Full-Stack Developer  
Focused on AI-powered web applications and scalable systems.

---

## ⭐ Support

If you like this project, give it a star on GitHub.
