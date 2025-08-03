from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
import json
import google.generativeai as genai

from backend.models import User, DailyTask, UserFocusLog
from backend.database import get_db
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/weekly-reviews", tags=["Weekly Reviews"])
CurrentUser = Annotated[dict, Depends(get_current_user)]

# Gemini AI Ayarları
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni ayarlanmamış. .env dosyanızı kontrol edin.")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')

# ------------------ 1. Haftalık İstatistik ------------------
@router.get("/weekly/current")
def get_current_week_stats(user: CurrentUser, db: Session = Depends(get_db)):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)

    tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user.id,
        DailyTask.date >= start_date.date(),
        DailyTask.date <= end_date.date()
    ).all()

    completed = [t for t in tasks if t.is_completed]
    incomplete = [t for t in tasks if not t.is_completed]

    avg_duration = (
        sum([t.duration_minutes for t in completed if t.duration_minutes is not None]) / len(completed)
        if completed else 0
    )

    stats = {
        "total_tasks": len(tasks),
        "completed_tasks": len(completed),
        "incomplete_tasks": len(incomplete),
        "completion_rate": round(len(completed) / len(tasks), 2) if tasks else 0,
        "avg_duration_minutes": round(avg_duration, 1),
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
    }

    return stats

# ------------------ 2. Haftalık AI Yorum & Geliştirme ------------------
@router.get("/weekly/comment")
async def get_weekly_comment_and_improvements(user: CurrentUser, db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    start_week = today - timedelta(days=today.weekday())
    end_week = start_week + timedelta(days=6)

    # Görev verileri
    tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user.id,
        DailyTask.date >= start_week.date(),
        DailyTask.date <= end_week.date()
    ).all()

    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.is_completed])
    incomplete_tasks = total_tasks - completed_tasks
    completion_rate = completed_tasks / total_tasks if total_tasks > 0 else 0
    avg_duration = (
        sum([t.duration_minutes for t in tasks if t.is_completed and t.duration_minutes is not None]) / completed_tasks
        if completed_tasks > 0 else 0
    )

    # Focus Feedback verileri
    focus_logs = db.query(UserFocusLog).filter(
        UserFocusLog.user_id == user.id,
        UserFocusLog.date >= start_week.date(),
        UserFocusLog.date <= end_week.date()
    ).all()

    avg_focus_minutes = sum(log.focus_minutes for log in focus_logs) / len(focus_logs) if focus_logs else 0
    applied_tips = len([log for log in focus_logs if log.tip_feedback == "Uyguladım"])
    ignored_tips = len([log for log in focus_logs if log.tip_feedback == "İlginç değil"])
    week_number = datetime.utcnow().isocalendar().week
    # AI Prompt
    prompt = f"""
    Kullanıcının bu haftaki görev ve odak performansını analiz et...
    Her seferinde farklı öneriler üretmek için yaratıcı ol.

    Veriler:
    - Toplam Görev: {total_tasks}
    - Tamamlanan Görev: {completed_tasks}
    - Tamamlanmayan Görev: {incomplete_tasks}
    - Tamamlama Oranı: %{completion_rate * 100:.2f}
    - Ortalama Görev Süresi: {avg_duration:.1f} dakika
    - Ortalama Odak Süresi: {avg_focus_minutes:.1f} dakika
    - Öneri Uygulama: {applied_tips} kez
    - Öneri Reddedilme: {ignored_tips} kez

    JSON Formatı:
    {{
      "comment": "string",
      "areas_for_improvement": ["string", "string"]
    }}
    """

    try:
        response = gemini_model.generate_content(prompt)
        ai_response_text = response.text.strip()

        if ai_response_text.startswith("```json"):
            ai_response_text = ai_response_text.replace("```json", "").replace("```", "").strip()

        parsed_response = json.loads(ai_response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI hatası: {str(e)}")

    return {
        "user_id": user.id,
        "comment": parsed_response.get("comment", "Yorum yok."),
        "areas_for_improvement": parsed_response.get("areas_for_improvement", [])
    }

# ------------------ 3. Haftalık Karşılaştırma ------------------
@router.get("/weekly-comparison/{user_id}")
async def get_weekly_comparison(user_id: int, db: Session = Depends(get_db)):
    current_week_end = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    current_week_start = current_week_end - timedelta(days=current_week_end.weekday())

    current_week_tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user_id,
        DailyTask.date >= current_week_start.date(),
        DailyTask.date <= (current_week_start + timedelta(days=6)).date()
    ).all()

    current_completed = len([t for t in current_week_tasks if t.is_completed])
    current_total = len(current_week_tasks)
    current_completion_rate = round(current_completed / current_total, 2) if current_total > 0 else 0

    # Önceki hafta
    previous_week_end = current_week_start - timedelta(days=1)
    previous_week_start = previous_week_end - timedelta(days=6)

    previous_week_tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user_id,
        DailyTask.date >= previous_week_start.date(),
        DailyTask.date <= previous_week_end.date()
    ).all()

    previous_completed = len([t for t in previous_week_tasks if t.is_completed])
    previous_total = len(previous_week_tasks)
    previous_completion_rate = round(previous_completed / previous_total, 2) if previous_total > 0 else 0

    return {
        "current_week": {
            "start_date": current_week_start.strftime("%Y-%m-%d"),
            "end_date": (current_week_start + timedelta(days=6)).strftime("%Y-%m-%d"),
            "total_tasks": current_total,
            "completed_tasks": current_completed,
            "completion_rate": current_completion_rate,
        },
        "previous_week": {
            "start_date": previous_week_start.strftime("%Y-%m-%d"),
            "end_date": previous_week_end.strftime("%Y-%m-%d"),
            "total_tasks": previous_total,
            "completed_tasks": previous_completed,
            "completion_rate": previous_completion_rate,
        },
        "changes": {
            "completed_tasks_change": current_completed - previous_completed,
            "completion_rate_change": round(current_completion_rate - previous_completion_rate, 2),
        }
    }

# ------------------ 4. Geri Bildirim API'leri ------------------
class FeedbackRequest(BaseModel):
    user_id: int
    comment_id: str = None
    is_helpful: bool
    feedback_text: str = None

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest, db: Session = Depends(get_db)):
    # TODO: Veritabanına kaydedilebilir
    print(f"Feedback from user {feedback.user_id}: {feedback.is_helpful}, {feedback.feedback_text}")
    return {"message": "Geri bildirim başarıyla alındı.", "status": "success"}

class TipFeedbackRequest(BaseModel):
    user_id: int
    date: datetime
    focus_minutes: int
    feedback: str  # "Uyguladım" veya "İlginç değil"

@router.post("/focus-feedback")
async def submit_focus_feedback(feedback: TipFeedbackRequest, db: Session = Depends(get_db)):
    log = UserFocusLog(
        user_id=feedback.user_id,
        date=feedback.date,
        focus_minutes=feedback.focus_minutes,
        tip_feedback=feedback.feedback
    )
    db.add(log)
    db.commit()
    return {"message": "Odak geri bildirimi kaydedildi."}

@router.get("/daily-focus-tip")
async def get_daily_focus_tip(user: CurrentUser, db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    week_logs = db.query(UserFocusLog).filter(
        UserFocusLog.user_id == user.id,
        UserFocusLog.date >= today - timedelta(days=7),
        UserFocusLog.date <= today
    ).all()

    avg_focus = sum(log.focus_minutes for log in week_logs) / len(week_logs) if week_logs else 0
    applied = len([log for log in week_logs if log.tip_feedback == "Uyguladım"])
    ignored = len([log for log in week_logs if log.tip_feedback == "İlginç değil"])

    prompt = f"""
    Bugün {today} tarihi. 
    Kullanıcının ortalama odak süresi {avg_focus:.1f} dakika.
    Geçen hafta {applied} öneri uygulandı, {ignored} öneri reddedildi.

    Kullanıcıya bugüne özel, motive edici ve kısa bir odak ipucu ver.
    Farklı ve yaratıcı bir öneri üret. 
    Örnek: "25 dakika odaklan, 5 dakika mola ver, bunu 4 kez tekrarla."
    """

    try:
        response = gemini_model.generate_content(
            prompt,
            generation_config={"temperature": 0.9, "top_p": 0.9}
        )
        tip = response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI hatası: {str(e)}")

    return {"date": str(today), "tip": tip}
