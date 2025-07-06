from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from backend.services.auth_service import get_current_user
from backend.database import get_db
from backend.schemas.daily_task import DailyTaskCreate, DailyTaskUpdate, DailyTaskOut
from backend.crud import daily_task as daily_task_crud
from typing import Annotated
from starlette import status
from backend.routers.auth import oauth2_scheme

# API endpointlerini tanımlayan router
router = APIRouter(
    prefix="/daily-tasks",             # URL prefix
    tags=["Daily Tasks"],              # Swagger'da grup etiketi
    dependencies=[Depends(oauth2_scheme)]  # Her endpoint için token kontrolü
)

# Kullanıcı doğrulamasını tip tanımıyla belirtiyoruz
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/", response_model=DailyTaskOut)
def create_task(user: user_dependency, task_in: DailyTaskCreate, db: Session = Depends(get_db)):
    """Yeni günlük görev oluşturur."""
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("id")
    return daily_task_crud.create_daily_task(db, task_in)


@router.get("/", response_model=List[DailyTaskOut])
def list_tasks_by_user(user: user_dependency, user_id: int, db: Session = Depends(get_db)):
    """Kullanıcıya ait tüm görevleri listeler (user_id parametresi gereksiz gibi duruyor)."""
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("id")  # dışarıdan user_id almak yerine auth'dan çekilmeli
    return daily_task_crud.get_all_tasks_by_user(db, user_id)


@router.get("/by-date/", response_model=List[DailyTaskOut])
def get_tasks_by_user_and_date(user: user_dependency, user_id: int, task_date: date, db: Session = Depends(get_db)):
    """Belirli bir tarihteki görevleri getirir."""
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("id")
    return daily_task_crud.get_tasks_by_user_and_date(db, user_id, task_date)


@router.get("/{task_id}", response_model=DailyTaskOut)
def get_task(user: user_dependency, task_id: int, db: Session = Depends(get_db)):
    """Belirli bir görevi ID'sine göre getirir."""
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("id")
    task = daily_task_crud.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
    return task


@router.put("/{task_id}", response_model=DailyTaskOut)
def update_task(user: user_dependency, task_id: int, task_update: DailyTaskUpdate, db: Session = Depends(get_db)):
    """Belirli bir görevi günceller."""
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("id")
    updated = daily_task_crud.update_daily_task(db, task_id, task_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Güncellenecek görev bulunamadı.")
    return updated


@router.delete("/{task_id}", response_model=dict)
def delete_task(user: user_dependency, task_id: int, db: Session = Depends(get_db)):
    """Belirli bir görevi siler."""
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("id")
    success = daily_task_crud.delete_daily_task(db, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Silinecek görev bulunamadı.")
    return {"deleted": True}


@router.post("/{task_id}/complete", response_model=DailyTaskOut)
def mark_task_complete(user: user_dependency, task_id: int, db: Session = Depends(get_db)):
    """Belirli bir görevi tamamlanmış olarak işaretler."""
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("id")
    task = daily_task_crud.mark_task_as_completed(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
    return task
