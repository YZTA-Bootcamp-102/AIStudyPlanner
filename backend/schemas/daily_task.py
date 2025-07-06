from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import Optional

class DailyTaskBase(BaseModel):
    """
    Günlük görev için temel alanları tanımlar.
    """
    title: str
    description: Optional[str] = None
    date: date
    start_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    learning_goal_id: Optional[int] = None
    calendar_event_id: Optional[str] = None

class DailyTaskCreate(DailyTaskBase):
    """
    Yeni görev oluşturmak için şema.
    """
    user_id: int

class DailyTaskUpdate(BaseModel):
    """
    Günlük görevi güncellemek için şema.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    is_completed: Optional[bool] = None
    learning_goal_id: Optional[int] = None
    calendar_event_id: Optional[str] = None

class DailyTaskOut(DailyTaskBase):
    """
    API'den dönen görev verisi.
    """
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
