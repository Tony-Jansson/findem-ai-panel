import httpx
import os
from io import BytesIO
from fastapi import UploadFile

async def speech_to_text(audio_file: UploadFile):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/audio/transcriptions",
                headers={"Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}"},
                files={"file": (audio_file.filename, await audio_file.read(), audio_file.content_type)},
                data={"model": "whisper-1"},
                timeout=30
            )
            return response.json()["text"]
    except Exception as e:
        raise Exception(f"Speech to text error: {str(e)}")

async def text_to_speech(text: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{os.getenv('ELEVENLABS_VOICE_ID')}",
                headers={
                    "xi-api-key": os.getenv('ELEVENLABS_API_KEY'),
                    "Content-Type": "application/json"
                },
                json={
                    "text": text,
                    "voice_settings": {
                        "stability": 0.7,
                        "similarity_boost": 0.8
                    }
                },
                timeout=30
            )
            return BytesIO(response.content)
    except Exception as e:
        raise Exception(f"Text to speech error: {str(e)}")
