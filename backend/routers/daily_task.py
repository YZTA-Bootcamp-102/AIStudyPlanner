from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Annotated
from datetime import date
from typing import Dict
from backend.models import User
from backend.database import get_db
from backend.schemas.daily_task import DailyTaskCreate, DailyTaskUpdate, DailyTaskOut
from backend.crud import daily_task as daily_task_crud
from backend.services.auth_service import get_current_user
from starlette import status

# API Router tanımı
router = APIRouter(
    prefix="/daily-tasks",
    tags=["Daily Tasks"]
)

# Kullanıcı doğrulamasını sağlayan dependency
CurrentUser = Annotated[dict, Depends(get_current_user)]


@router.get("/calendar-summary", response_model=Dict[str, int])
def get_calendar_task_summary(
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    """
    Kullanıcının görevleri için tarih bazlı özet (kaç görev hangi günde) döner.
    Örn: {"2025-08-02": 3, "2025-08-03": 1}
    """
    return daily_task_crud.get_task_counts_by_date(db, user.id)


@router.post("/", response_model=DailyTaskOut)
def create_task(
    task_in: DailyTaskCreate,
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    return daily_task_crud.create_daily_task(db, task_in, user_id=user.id)

@router.get("/", response_model=List[DailyTaskOut])
def list_tasks_by_user(
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    return daily_task_crud.get_all_tasks_by_user(db, user.id)



@router.get("/by-date/", response_model=List[DailyTaskOut])
def get_tasks_by_user_and_date(
    task_date: date,
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    """Belirli bir tarihteki görevleri getirir."""
    return daily_task_crud.get_tasks_by_user_and_date(db, user.id, task_date)


@router.get("/{task_id}", response_model=DailyTaskOut)
def get_task(
    task_id: int,
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    """Görev ID'sine göre görev detayını getirir."""
    task = daily_task_crud.get_task_by_id(db, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
    return task


@router.put("/{task_id}", response_model=DailyTaskOut)
def update_task(
    task_id: int,
    task_update: DailyTaskUpdate,
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    """Görevi günceller, yalnızca görevin sahibi güncelleme yapabilir."""
    task = daily_task_crud.get_task_by_id(db, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
    return daily_task_crud.update_daily_task(db, task_id, task_update)


@router.delete("/{task_id}", response_model=dict)
def delete_task(
    task_id: int,
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    """Görevi siler, yalnızca sahibi silebilir."""
    task = daily_task_crud.get_task_by_id(db, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
    success = daily_task_crud.delete_daily_task(db, task_id)
    return {"deleted": success}


@router.post("/{task_id}/complete", response_model=DailyTaskOut)
def mark_task_complete(
    task_id: int,
    user: CurrentUser,
    db: Session = Depends(get_db)
):
    """Görevi tamamlandı olarak işaretler."""
    task = daily_task_crud.get_task_by_id(db, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
    return daily_task_crud.mark_task_as_completed(db, task_id)
