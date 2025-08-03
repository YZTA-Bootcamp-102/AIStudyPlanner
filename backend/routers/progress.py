from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Annotated, Optional

from backend.database import get_db
from backend.schemas.progress import ProgressOut
from backend.crud.progress import get_progress, get_user_task_completion_rate, get_user_badge, \
    get_task_progress_feedback
from backend.services.auth_service import get_current_user


# Progress endpoint'
router = APIRouter(prefix="/progress", tags=["Progress"])
@router.get("/", response_model=list[ProgressOut], summary="Kullanıcı ilerleme verilerini getirir")
def read_progress(week: Optional[int] = None,
                  month: Optional[int] = None,
                  year: Optional[int] = None,
                  user: dict = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    """Kullanıcının ilerlemesini filtreli olarak listeler."""
    return get_progress(db, user["user_id"], week, month, year)

@router.get("/task-rate", summary="Kullanıcının görev tamamlama oranı")
def task_completion_rate(user = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = user["user_id"]
    rate = get_user_task_completion_rate(db, user_id)
    return {"task_completion_rate": rate}

@router.get("/task-feedback", summary="Görev tamamlama oranı + rozet + mesaj")
def task_feedback(user = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = user["user_id"]
    rate = get_user_task_completion_rate(db, user_id)
    badge = get_user_badge(rate)
    message = get_task_progress_feedback(rate)
    return {
        "completion_rate": round(rate, 2),
        "badge": badge,
        "message": message
    }