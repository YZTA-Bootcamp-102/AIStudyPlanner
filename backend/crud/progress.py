from sqlalchemy.orm import Session
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
