import os
import re
from typing import List
import google.generativeai as genai
from backend.schemas.sprint_plan import SprintResponse, WeeklySprint

# API anahtarı kontrolü ve ayarlama
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni ayarlanmamış. .env dosyasını kontrol edin.")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')
chat_session = gemini_model.start_chat(history=[])

def plan_sprint(topic: str, level: str, daily_minutes: int, duration_weeks: int) -> SprintResponse:
    """
    Gemini API ile öğrenme sprint planı oluşturur.
    """
    prompt = f"""
Lütfen aşağıdaki bilgilere göre bir öğrenme sprint planı oluştur:

- Konu: {topic}
- Seviye: {level}
- Günlük çalışma süresi: {daily_minutes} dakika
- Toplam süre: {duration_weeks} hafta

Format:
**Hafta 1:**
* Konu 1
* Konu 2
"""

    response = chat_session.send_message(prompt)
    content = response.text
    print("GEMINI RESPONSE:\n", content)

    parsed_weeks = parse_gemini_response(content, daily_minutes)
    weeks_as_dicts = [w.model_dump() for w in parsed_weeks]
    return SprintResponse(weeks=weeks_as_dicts)

def parse_gemini_response(text: str, daily_minutes: int) -> List[WeeklySprint]:
    """
    Gemini'den gelen metni WeeklySprint listesine parse eder.
    """
    weeks: List[WeeklySprint] = []
    current_week = None
    current_topics: List[str] = []

    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue

        week_match = re.match(r"(?:\*\*)?Hafta\s*(\d+)", line, re.IGNORECASE)
        if week_match:
            if current_week is not None:
                weeks.append(WeeklySprint(
                    week_number=current_week,
                    topics=current_topics,
                    daily_minutes=daily_minutes
                ))
            current_week = int(week_match.group(1))
            current_topics = []
            continue

        if line.startswith(("*", "-", "•")):
            topic = re.sub(r"^[\*\-\•]+\s*", "", line)
            if topic and not topic.lower().startswith("gün"):
                current_topics.append(topic)

    if current_week is not None and current_topics:
        weeks.append(WeeklySprint(
            week_number=current_week,
            topics=current_topics,
            daily_minutes=daily_minutes
        ))

    return weeks
