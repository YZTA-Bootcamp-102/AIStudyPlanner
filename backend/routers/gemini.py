import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv


# API key konfigürasyonu
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str

@router.post("/gemini/ask")
async def ask_gemini(data: PromptRequest):
    try:
        model = genai.GenerativeModel(model_name="models/gemini-pro")
        response = model.generate_content(data.prompt)
        return {"response": response.text}
    except Exception as e:
        print("Gemini Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
