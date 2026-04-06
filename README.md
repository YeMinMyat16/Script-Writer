# Script Writer 🎬

A modern, full-stack AI-powered script writing application that generates cinematic movie scripts based on your ideas.

It features a stunning, premium dark-mode "Cinema Premiere" aesthetic, complete with script-like formatting, and fully configurable generation parameters.

![Dashboard Preview](SS/Screenshot%202026-04-06%20100057.png)

## ✨ Features

- **AI Story Generation:** Powered by Google's powerful Gemini AI perfectly structured into script format.
- **Cinematic UI:** Beautiful glassmorphic dark-mode, glowing theatre-style elements, and dynamic Framer Motion animations.
- **Highly Configurable Parameters:**
  - **Genre:** Action, Sci-Fi, Horror, Romance, Mystery.
  - **Scenes:** Choose the exact number of scenes / acts.
  - **Ending:** Twist, Happy, Tragic, Ambiguous.
  - **Pacing:** Control the length of the generated scenes.
  - **Dialogue Focus:** Set the conversational density.
  - **English Level:** Limit the AI's vocabulary from Simple up to Advanced.
- **Modern Script Format:** Result output displays beautifully formatted scenes, dialogue focuses, and character interactions.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** Python, FastAPI, Uvicorn, Google Gemini Generative AI.

## 🚀 How to Run Locally

### 1. Start the Backend
1. Open a terminal and navigate to the `backend` directory.
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_api_key_here
   ```
4. Run the server: `python -m uvicorn main:app --reload`

### 2. Start the Frontend
1. Open a new terminal in the root directory.
2. Install dependencies: `npm install`
3. Start the Vite server: `npm run dev`
4. Open the displayed URL in your browser to start writing!
