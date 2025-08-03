import google.generativeai as genai
from backend.schemas.ai_hint import AIHintCreate
from backend.models.ai_hint import AIHint
from sqlalchemy.orm import Session
from datetime import datetime, date
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_ai_hint(goal_text: str, level: str) -> str:
    """
    Kullanıcının öğrenme hedefine göre AI'dan ipucu üretir.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    Kullanıcının öğrenme hedefi: "{goal_text}" ve seviyesi: "{level}".

    Bu hedefe ulaşmasına yardımcı olacak kısa, uygulanabilir ve motive edici bir öneri (ipucu) ver.
    Sadece düz metin dön. Açıklama, emoji veya başlık ekleme.
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("AI Hint üretimi hatası:", e)
        return "Bugünlük ipucu verilemedi."
