from sqlalchemy.orm import Session
from datetime import date
from typing import Optional, List

from backend.models.daily_task import DailyTask
from backend.schemas.daily_task import DailyTaskCreate, DailyTaskUpdate

def create_daily_task(db: Session, task_in: DailyTaskCreate) -> DailyTask:
    """
    Yeni günlük görev oluşturur.
    """
    task = DailyTask(**task_in.dict())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_task_by_id(db: Session, task_id: int) -> Optional[DailyTask]:
    """
    ID'ye göre tek bir görevi getirir.
    """
    return db.query(DailyTask).filter(DailyTask.id == task_id).first()

def get_tasks_by_user_and_date(db: Session, user_id: int, task_date: date) -> List[DailyTask]:
    """
    Belirli bir kullanıcıya ait bir günün görevlerini getirir.
    """
    return db.query(DailyTask).filter(
        DailyTask.user_id == user_id,
        DailyTask.date == task_date
    ).order_by(DailyTask.start_time).all()

def get_all_tasks_by_user(db: Session, user_id: int) -> List[DailyTask]:
    """
    Kullanıcının tüm görevlerini getirir (yeniden eskiye).
    """
    return db.query(DailyTask).filter(DailyTask.user_id == user_id).order_by(DailyTask.date.desc()).all()

def update_daily_task(db: Session, task_id: int, update_data: DailyTaskUpdate) -> Optional[DailyTask]:
    """
    Görev bilgilerini günceller.
    """
    task = get_task_by_id(db, task_id)
    if not task:
        return None

    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task

def delete_daily_task(db: Session, task_id: int) -> bool:
    """
    Görevi siler.
    """
    task = get_task_by_id(db, task_id)
    if not task:
        return False

    db.delete(task)
    db.commit()
    return True

def mark_task_as_completed(db: Session, task_id: int) -> Optional[DailyTask]:
    """
    Görevi tamamlanmış olarak işaretler.
    """
    task = get_task_by_id(db, task_id)
    if not task:
        return None

    task.is_completed = True
    db.commit()
    db.refresh(task)
    return task
