import os
import requests
from typing import List
from backend.schemas.learning import LearningModuleCreate
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri yükler
load_dotenv()

# Google Gemini API anahtarı ve istek URL'si
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText"

def generate_learning_modules(goal_text: str, interest_areas: str, level: str) -> List[LearningModuleCreate]:
    """
    Google Gemini API (PaLM 2) kullanarak, kullanıcı hedeflerine göre öğrenme modülleri üretir.

    Parametreler:
        goal_text: Kullanıcının genel öğrenme hedefi (örneğin "Python'da uzmanlaşmak")
        interest_areas: Kullanıcının ilgi alanları (örneğin "Python, Veri Bilimi")
        level: Kullanıcının mevcut bilgi seviyesi (örneğin "başlangıç", "orta", "ileri")

    Dönüş:
        AI tarafından oluşturulan öğrenme modüllerinin LearningModuleCreate listesi
    """

    if not GOOGLE_API_KEY:
        # Ortam değişkeni tanımlı değilse hata fırlat
        raise ValueError("GOOGLE_API_KEY not found in environment.")

    # AI modeline gönderilecek istem (prompt) metni
    prompt = f"""
Sen bir eğitim asistanısın. Kullanıcının hedefi: "{goal_text}". İlgi alanları: "{interest_areas}". Seviyesi: "{level}".

Bu bilgiler ışığında, kullanıcının öğrenmesini destekleyecek 2-4 adet öğrenme modülü öner. Her modül şu formatta olsun:

- Başlık
- Açıklama
- Kategori
- Sıra
- Öğrenme çıktısı

JSON formatında bir liste döndür:
[
  {{
    "title": "...",
    "description": "...",
    "category": "...",
    "order": 1,
    "learning_outcome": "..."
  }},
  ...
]
    """

    # Google Gemini API'ye istek gönderiliyor
    response = requests.post(
        GEMINI_API_URL,
        params={"key": GOOGLE_API_KEY},
        json={"prompt": {"text": prompt}, "temperature": 0.7}
    )

    # API'den hata dönerse durumu kullanıcıya bildir
    if response.status_code != 200:
        raise RuntimeError(f"Gemini API error: {response.status_code} - {response.text}")

    try:
        # API yanıtından metin (JSON string olarak dönmüş modül listesi) alınır
        text_response = response.json()["candidates"][0]["output"]

        # Not: eval() güvenli değil! Sadece güvenilir kaynaklardan gelen JSON metniyle kullanılmalı.
        # Gerçek projede burada json.loads() kullanılmalıdır.
        module_dicts = eval(text_response)

        # JSON'dan oluşturulan dict'leri LearningModuleCreate nesnelerine dönüştür
        return [LearningModuleCreate(**module) for module in module_dicts]

    except Exception as e:
        # API'den gelen cevap çözümlenemediğinde hata döndür
        raise ValueError(f"AI'dan gelen yanıt işlenemedi: {e}")
