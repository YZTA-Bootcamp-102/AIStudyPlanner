from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.orm import Session

from backend.models.enums import NotificationMethod
from backend.models.reminder import Reminder

def create_reminder(db: Session, task_id: int, offset_before: timedelta,
                    method: NotificationMethod, message: Optional[str] = None) -> Reminder:
    """
    Yeni hatırlatma oluşturur ve kaydeder.
    """
    from backend.crud.daily_task import get_task_by_id
    task = get_task_by_id(db, task_id)
    if not task:
        return None

    notify_time = datetime.combine(task.date, task.start_time) - offset_before
    reminder = Reminder(task_id=task_id, notify_time=notify_time, method=method, message=message)
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder

def get_reminder_by_id(db: Session, reminder_id: int) -> Optional[Reminder]:
    """
    ID'ye göre hatırlatma nesnesini döner veya None.
    """
    return db.query(Reminder).filter(Reminder.id == reminder_id).first()

def get_all_reminders(db: Session) -> List[Reminder]:
    """Tüm hatırlatmaları listeler."""
    return db.query(Reminder).all()

def get_upcoming_reminders(db: Session, current_time: Optional[datetime] = None) -> List[Reminder]:
    """
    Henüz gönderilmemiş ve zamanı gelmiş hatırlatmaları getirir.
    """
    current_time = current_time or datetime.utcnow()
    return db.query(Reminder).filter(Reminder.sent == 0, Reminder.notify_time <= current_time).all()

def get_pending(db: Session, at_time: datetime) -> List[Reminder]:
    return db.query(Reminder).filter(Reminder.sent == 0, Reminder.notify_time <= at_time).all()

def update_reminder(db: Session, reminder_id: int, **kwargs) -> Optional[Reminder]:
    """
    Belirtilen alanları günceller, başlıca notify_time, message vs.
    """
    reminder = get_reminder_by_id(db, reminder_id)
    if not reminder:
        return None
    for key, value in kwargs.items():
        if hasattr(reminder, key):
            setattr(reminder, key, value)
    db.commit()
    db.refresh(reminder)
    return reminder

def delete_reminder(db: Session, reminder_id: int) -> bool:
    """Hatırlatmayı siler."""
    reminder = get_reminder_by_id(db, reminder_id)
    if not reminder:
        return False
    db.delete(reminder)
    db.commit()
    return True

def mark_as_sent(db: Session, reminder_id: int) -> Optional[Reminder]:
    """
    Hatırlatmayı gönderilmiş olarak işaretler.
    """
    reminder = get_reminder_by_id(db, reminder_id)
    if reminder:
        reminder.sent = 1
        db.commit()
        db.refresh(reminder)
    return reminder
