from sqlalchemy.orm import Session

from backend.models import DailyTask
from backend.models.progress import Progress

def get_progress(db: Session, user_id: int, week: int=None, month: int=None, year: int=None):
    """
    Kullanıcının ilerlemesini döner. Hafta/ay/yıl filtreleme bulunur.
    """
    q = db.query(Progress).filter(Progress.user_id == user_id)
    if week:
        q = q.filter(Progress.week == week)
    if month:
        q = q.filter(Progress.month == month)
    if year:
        q = q.filter(Progress.year == year)
    return q.all()
def get_user_task_completion_rate(db: Session, user_id: int) -> float:
    total = db.query(DailyTask).filter_by(user_id=user_id).count()
    completed = db.query(DailyTask).filter_by(user_id=user_id, is_completed=True).count()
    return (completed / total * 100) if total else 0.0

def get_user_badge(rate: float) -> str:
    if rate >= 90:
        return "🏅 Altın Rozet"
    elif rate >= 75:
        return "🥈 Gümüş Rozet"
    elif rate >= 50:
        return "🥉 Bronz Rozet"
    return "🚀 Yeni Başlayan"

def get_task_progress_feedback(rate: float) -> str:
    if rate >= 90:
        return "Harika gidiyorsunuz! Hedefinize çok yakınsınız."
    elif rate >= 75:
        return "İyi iş! Biraz daha gayretle daha iyi olabilirsiniz."
    elif rate >= 50:
        return "Yolun yarısındasınız, devam edin!"
    return "Yeni başlıyorsunuz, istikrarlı şekilde devam edin!"
