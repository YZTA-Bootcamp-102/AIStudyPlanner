import os
import re
import google.generativeai as genai
from schemas.sprint import SprintResponse, WeeklySprint
from typing import List

# API Key kontrolü
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni ayarlanmamış. .env dosyanızı kontrol edin.")

genai.configure(api_key=GEMINI_API_KEY)

# Gemini model oluştur
gemini_model = genai.GenerativeModel('gemini-2.0-flash')
chat_session = gemini_model.start_chat(history=[])


def plan_sprint(topic: str, level: str, daily_minutes: int, duration_weeks: int) -> SprintResponse:
    prompt = f"""
    Lütfen aşağıdaki bilgilere göre bir öğrenme sprint planı oluştur:

    - Konu: {topic}
    - Seviye: {level}
    - Günlük çalışma süresi: {daily_minutes} dakika
    - Toplam süre: {duration_weeks} hafta

    Her hafta için ayrı başlık kullan: Örneğin "**Hafta 1:**".
    Her haftanın altında günlük olarak çalışılacak konuları madde işaretiyle belirt:
    Örnek format:
    **Hafta 1:**
    * Değişkenler ve veri tipleri
    * Koşullu ifadeler

    Yalnızca konu başlıklarını içeren kısa maddeler ver.
    """

    response = chat_session.send_message(prompt)
    content = response.text
    print("GEMINI RESPONSE:\n", content)

    parsed_weeks = parse_gemini_response(content, daily_minutes)
    return SprintResponse(weeks=parsed_weeks)


def parse_gemini_response(text: str, daily_minutes: int) -> List[WeeklySprint]:
    weeks = []
    current_week = None
    current_topics = []

    lines = text.splitlines()
    for line in lines:
        line = line.strip()

        if not line:
            continue

        # Hafta başlığı: "**Hafta 1:" veya "Hafta 1:"
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

        # Madde işaretli satırlar
        if line.startswith("*") or line.startswith("-") or line.startswith("•"):
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
