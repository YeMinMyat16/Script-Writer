import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv, find_dotenv

# Load environment variables from the parent directory's .env file
load_dotenv(find_dotenv())

app = FastAPI(title="AI Story Generator API")

# Enable CORS so the Vite frontend can make requests to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input data model (Now matches your frontend UI exactly!)
class StoryRequest(BaseModel):
    idea: str
    genre: str
    sceneCount: int
    endingType: str
    length: str
    dialogueLevel: str
    englishLevel: str

@app.post("/generate-story")
async def generate_story(request: StoryRequest):
    # Validate input
    if not request.idea.strip():
        raise HTTPException(status_code=400, detail="The 'idea' field cannot be empty.")
    
    # Check if API key is configured
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable is not set.")
    
    # Configure Gemini API
    genai.configure(api_key=api_key)
    
    # Construct the highly detailed prompt with all your chosen variables
    prompt = f"""You are a cinematic AI storyteller.

Create a short film script based on the user input.

Requirements:
- Title
- {request.sceneCount} scenes
- Include dialogue in each scene (based on dialogue level)
- Strong {request.endingType.lower()} ending

Length:
- {request.length} (Short = brief scenes, Long = detailed scenes)

Language Level:
- {request.englishLevel} English

Dialogue level:
- {request.dialogueLevel} (Low = minimal dialogue, Medium = balanced, High = dialogue-rich scenes)

Make it:
- Engaging and easy to visualize
- Well-structured
- Not repetitive

Genre: {request.genre}
Idea: {request.idea}

Format your response EXACTLY like this (use these exact labels):
Title: [The Title]

Scene 1:
[Description]

Scene 2:
[Description]

Scene 3:
[Description]
(Include scene 4 and 5 if requested)

Dialogue:
[Include all key dialogue here]

Ending:
[The Ending]"""

    try:
        # Use the requested model
        model = genai.GenerativeModel('gemini-3-flash-preview')
        response = model.generate_content(prompt)
        
        return {"story": response.text}
        
    except Exception as e:
        # Catch and return any API or generation errors gracefully
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "AI Story Generator API is up and running!"}
