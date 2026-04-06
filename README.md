<div align="center">
  <img src="SS/Screenshot%202026-04-06%20144825.png" alt="ScriptCraft Hero Panel" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"/>
  
  <br/>
  
  # ScriptCraft V2: Premium AI Cinematic Generator
  
  **Generate Hollywood-grade, perfectly formatted scripts and high-impact titles in seconds using Google Gemini AI.**
  
  <img src="https://img.shields.io/badge/Next.js%2016-Black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" />
</div>

<br/>

## 🎬 About The Project

ScriptCraft is a bleeding-edge architectural upgrade to the classic AI Script Writer. Transitioning from a basic React/Vite layout to a full-stack Next.js + FastAPI ecosystem, ScriptCraft now delivers a truly premium "Cinema Premiere" aesthetic. 

From its dynamic, interactive WebGL fluid background to its intelligent local-storage Archiving system, ScriptCraft feels less like a website and more like a high-end application for professional directors and hobbyists alike.

<div align="center">
  <img src="SS/Screenshot%202026-04-06%20144845.png" alt="ScriptCraft Dashboard" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-top: 15px; margin-bottom: 15px;" />
</div>

---

## ✨ Core Features

*   **🎬 Cinematic Story Generator:** Select your Genre, Pacing, Ending Type, Dialogue Density, and English Level. The AI outputs a beautifully formatted Scene-by-Scene cinematic script.
*   **📚 Intelligent Title Brainstorming:** Stuck on a name? The Title Generator hooks directly into Gemini with specialized copywriting parameters to give you 5 highly-engaging blockbuster titles based on a single thought.
*   **🧠 Local Memory Archives:** Never lose a script. ScriptCraft natively saves the exact cinematic formatting and original prompts for every single generation directly to your machine. Wield full control with single-delete or memory wipe capabilities.
*   **💅 Premium WebGL UX:** The entire application is powered by responsive Framer Motion components and a bespoke interactive Three.js liquid-glass shader that reacts fluently to your mouse movements.

---

## 🛠️ Architecture & Tech Stack

ScriptCraft is physically split into two distinct, high-performance engines:

**Frontend Engine:**
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS V4 + Shadcn UI
*   **Animation & Graphics:** Framer Motion & Three.js (GLSL Shaders)
*   **State:** React Hooks + LocalStorage API

**Backend Engine:**
*   **Framework:** Python FastAPI
*   **LLM Integration:** `google-generativeai` (utilizing `gemini-3-flash-preview`)
*   **Server:** Uvicorn Async Workers

---

## 🚀 Getting Started

To run ScriptCraft locally, you must spin up both the FastAPI backend and the Next.js frontend concurrently.

### 1. Backend Setup (FastAPI + Gemini)
You will need your own Google Gemini API key to run the engine.
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Create a .env file and add your key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# 4. Launch the AI Server
python -m uvicorn main:app --reload
# The backend will start on http://127.0.0.1:8000
```

### 2. Frontend Setup (Next.js)
Open a brand new, separate terminal window.
```bash
# 1. Navigate to the project root
cd Script-Writer

# 2. Install Node dependencies
npm install

# 3. Launch the Next.js Development Server
npm run dev
# The cinematic app will launch on http://localhost:3000
```

---

<div align="center">
  <i>"A 21 Dev Project."</i>
</div>
