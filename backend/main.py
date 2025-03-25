from fastapi import FastAPI, HTTPException, UploadFile, Form, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os
import base64
from backend.ai_integrations import get_ai_response
from backend.audio_utils import text_to_speech, speech_to_text
from fastapi.responses import FileResponse
from dotenv import load_dotenv

# Ladda miljövariabler
load_dotenv()

app = FastAPI()

# Montera statiska filer
app.mount("/static", StaticFiles(directory=Path(__file__).parent.parent / "frontend/build/static"), name="static")

security = HTTPBasic()

def get_current_user(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = os.getenv("ADMIN_USERNAME")
    correct_password = os.getenv("ADMIN_PASSWORD")
    
    if (credentials.username == correct_username and 
        credentials.password == correct_password):
        return credentials.username
    
    raise HTTPException(
        status_code=401,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Basic"},
    )

@app.post("/api/chat")
async def chat_endpoint(
    message: str = Form(None),
    audio: UploadFile = Form(None),
    user: str = Depends(get_current_user)
):
    try:
        if audio:
            user_message = await speech_to_text(audio)
        else:
            user_message = message
        
        text_response = await get_ai_response(user_message)
        audio_bytes = await text_to_speech(text_response)
        audio_b64 = base64.b64encode(audio_bytes.getvalue()).decode('utf-8')
        
        return {
            "text": user_message,
            "response": text_response,
            "audio": audio_b64
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/{full_path:path}")
async def serve_frontend():
    return FileResponse(Path(__file__).parent.parent / "frontend/build/index.html")
