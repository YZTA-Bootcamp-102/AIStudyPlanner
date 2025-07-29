from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import DailyTask
from datetime import datetime, timedelta
import os
import google.generativeai as genai
import json 
from pydantic import BaseModel

router = APIRouter(prefix="/weekly-stats", tags=["Weekly Stats"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni ayarlanmamış. .env dosyanızı kontrol edin.")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash') 

@router.get("/current-week-stats")
def get_current_week_stats(user_id: int, db: Session = Depends(get_db)):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7) # Son 7 gün

    tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user_id,
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

@router.get("/comment-and-improvements")
async def get_weekly_comment_and_improvements(user_id: int, db: Session = Depends(get_db)):
    """
    Belirli bir kullanıcının haftalık görev istatistiklerine göre AI yorumu ve
    geliştirme alanlarını döndürür.
    """
    # Bu hafta tarih aralığını hesapla (Pazartesi'den Pazar'a)
    today = datetime.utcnow()
    # Zaman dilimi sorunlarını önlemek için tarihi gün başına normalize et
    today = today.replace(hour=0, minute=0, second=0, microsecond=0)

    # Haftanın başlangıcını (Pazartesi) hesapla
    start_week = today - timedelta(days=today.weekday())
    # Haftanın sonunu (Pazar) hesapla
    end_week = start_week + timedelta(days=6)

    # Haftalık görevleri veritabanından çek
    tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user_id,
        DailyTask.date >= start_week.date(),
        DailyTask.date <= end_week.date()
    ).all()

    total_tasks = len(tasks)
    completed_tasks = len([t for t in tasks if t.is_completed])
    incomplete_tasks = len([t for t in tasks if not t.is_completed])
    completion_rate = completed_tasks / total_tasks if total_tasks > 0 else 0

    # Tamamlanan görevler için ortalama süre hesapla
    avg_duration = (
        sum([t.duration_minutes for t in tasks if t.is_completed and t.duration_minutes is not None]) / completed_tasks
        if completed_tasks > 0 else 0
    )

    prompt = f"""
    Kullanıcının bu haftaki görev tamamlama performansını analiz et ve aşağıdaki JSON formatında bir yorum ve geliştirme alanları listesi sun.
    Yorum kısa, motive edici ve genel bir değerlendirme içermeli.
    Geliştirme alanları ise spesifik, eyleme geçirilebilir öneriler olmalı ve maddeler halinde belirtilmeli.

    Veriler:
    - Toplam Görev: {total_tasks}
    - Tamamlanan Görev: {completed_tasks}
    - Tamamlanmayan Görev: {incomplete_tasks}
    - Tamamlama Oranı: %{completion_rate*100:.2f}
    - Ortalama Tamamlama Süresi (tamamlananlar için): {avg_duration:.1f} dakika

    JSON Formatı:
    {{
      "comment": "string",
      "areas_for_improvement": [
        "string",
        "string"
      ]
    }}
    """

    try:
        # Gemini API çağrısı yap
        response = gemini_model.generate_content(prompt)
        ai_response_text = response.text.strip()

        # Gemini'nin yanıtındaki JSON bloğunu ayıkla (bazen başında veya sonunda markdown bloğu olabilir)
        if ai_response_text.startswith("```json"):
            ai_response_text = ai_response_text.replace("```json", "").replace("```", "").strip()
        
        # JSON yanıtını ayrıştır
        parsed_response = json.loads(ai_response_text)
        
        comment = parsed_response.get("comment", "Yorum oluşturulamadı.")
        areas_for_improvement = parsed_response.get("areas_for_improvement", [])

    except json.JSONDecodeError as e:
        print(f"JSON ayrıştırma hatası: {e}")
        print(f"AI'dan gelen ham metin: {ai_response_text}")
        raise HTTPException(status_code=500, detail=f"AI'dan gelen yanıt JSON formatında değil veya hatalı: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI yorumu oluşturulurken hata oluştu: {str(e)}")

    return {
        "user_id": user_id,
        "comment": comment,
        "areas_for_improvement": areas_for_improvement
    }

@router.get("/weekly-comparison/{user_id}")
async def get_weekly_comparison(user_id: int, db: Session = Depends(get_db)):
    """
    Belirli bir kullanıcının mevcut hafta ile önceki hafta görev istatistiklerini karşılaştırır.
    """
    # Mevcut hafta istatistikleri
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

    # Önceki hafta istatistikleri
    previous_week_end = current_week_start - timedelta(days=1) # Önceki haftanın sonu (Pazar)
    previous_week_start = previous_week_end - timedelta(days=6) # Önceki haftanın başlangıcı (Pazartesi)

    previous_week_tasks = db.query(DailyTask).filter(
        DailyTask.user_id == user_id,
        DailyTask.date >= previous_week_start.date(),
        DailyTask.date <= previous_week_end.date()
    ).all()

    previous_completed = len([t for t in previous_week_tasks if t.is_completed])
    previous_total = len(previous_week_tasks)
    previous_completion_rate = round(previous_completed / previous_total, 2) if previous_total > 0 else 0

    comparison = {
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
    return comparison

# Geri bildirim modeli
class FeedbackRequest(BaseModel):
    user_id: int
    comment_id: str = None # Eğer belirli bir AI yorumunu takip ediyorsanız
    is_helpful: bool # Yorum faydalı mı? (True/False)
    feedback_text: str = None # İsteğe bağlı metin geri bildirimi

@router.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest, db: Session = Depends(get_db)):
    """
    Kullanıcıdan AI yorumu hakkında geri bildirim alır ve kaydeder.
    """
    # Burada geri bildirimi veritabanınıza kaydetmelisiniz.
    # Bunun için yeni bir SQLAlchemy modeli (örneğin FeedbackModel) oluşturmanız gerekebilir.
    # Örnek:
    # new_feedback = FeedbackModel(
    #     user_id=feedback.user_id,
    #     comment_id=feedback.comment_id,
    #     is_helpful=feedback.is_helpful,
    #     feedback_text=feedback.feedback_text,
    #     timestamp=datetime.utcnow()
    # )
    # db.add(new_feedback)
    # db.commit()
    # db.refresh(new_feedback)

    print(f"Kullanıcı {feedback.user_id} için geri bildirim alındı: Faydalı={feedback.is_helpful}, Metin={feedback.feedback_text}")
    return {"message": "Geri bildirim başarıyla alındı.", "status": "success"}

