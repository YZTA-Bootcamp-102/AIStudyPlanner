from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from backend.models.enums import NotificationMethod
class ReminderBase(BaseModel):
    """
    Bildirim (Reminder) tablosundaki temel alanları tanımlar.
    """
    task_id: int
    notify_time: datetime
    method: NotificationMethod
    message: str

class ReminderCreate(ReminderBase):
    """Yeni hatırlatma oluşturmak için veri şeması."""
    pass

class ReminderUpdate(BaseModel):
    """Var olan hatırlatmayı güncellemek için şema."""
    notify_time: datetime | None = None
    method: NotificationMethod | None = None
    message: str | None = None
    sent: bool | None = None

class ReminderOut(ReminderBase):
    """
    API'den dönen hatırlatma verisi.
    """
    id: int
    sent: bool
    sent_at: datetime | None = None

    class Config:
        orm_mode = True

class ReminderCreateOut(BaseModel):
    id: int
    task_id: int
    notify_time: datetime
    method: NotificationMethod
    message: str | None
    sent: int
    created_at: datetime

    class Config:
        orm_mode = True