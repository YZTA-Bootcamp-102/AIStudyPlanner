from pydantic import BaseModel
from datetime import datetime

class UserActivityCreate(BaseModel):
    minutes_focused: int
    notes: str | None = None

class UserActivityOut(UserActivityCreate):
    id: int
    activity_date: datetime

    class Config:
        orm_mode = True

class AITipCreate(BaseModel):
    tip_text: str

class AITipOut(AITipCreate):
    id: int
    shown_at: datetime | None
    created_at: datetime
    feedback: str | None
    is_applied: bool

    class Config:
        orm_mode = True
