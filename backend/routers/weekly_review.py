
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Annotated
from datetime import datetime, timedelta, date
from pydantic import BaseModel
import os
import json
import google.generativeai as genai

from backend.models import User, DailyTask
from backend.database import get_db
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/weekly-reviews", tags=["Weekly Reviews"])
user_dep = Annotated[dict, Depends(get_current_user)]

CurrentUser = Annotated[dict, Depends(get_current_user)]

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni ayarlanmamış. .env dosyanızı kontrol edin.")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')


@router.get("/weekly/current")
def get_current_week_stats(user: CurrentUser, db: Session = Depends(get_db)):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)

    tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user["id"],
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


@router.get("/weekly/comment")
async def get_weekly_comment_and_improvements(user: CurrentUser, db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    start_week = today - timedelta(days=today.weekday())
    end_week = start_week + timedelta(days=6)

    tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user["id"],
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

    prompt = f"""..."""  # Prompt aynı kalabilir

    try:
        response = gemini_model.generate_content(prompt)
        ai_response_text = response.text.strip()

        if ai_response_text.startswith("```json"):
            ai_response_text = ai_response_text.replace("```json", "").replace("```", "").strip()
        parsed_response = json.loads(ai_response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI hatası: {str(e)}")

    return {
        "user_id": user["id"],
        "comment": parsed_response.get("comment", "Yorum yok."),
        "areas_for_improvement": parsed_response.get("areas_for_improvement", [])
    }


@router.get("/weekly/comparison")
async def get_weekly_comparison(user: CurrentUser, db: Session = Depends(get_db)):
    # Mevcut ve önceki hafta karşılaştırması — kod aynen kalabilir
    ...


class FeedbackRequest(BaseModel):
    user_id: int
    comment_id: str = None
    is_helpful: bool
    feedback_text: str = None

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest, db: Session = Depends(get_db)):
    # Veritabanı işlemi eklenecek
    print(f"Feedback from user {feedback.user_id}: {feedback.is_helpful}, {feedback.feedback_text}")
    return {"message": "Geri bildirim başarıyla alındı.", "status": "success"}