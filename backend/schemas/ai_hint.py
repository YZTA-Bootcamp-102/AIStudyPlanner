from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class AIHintBase(BaseModel):
    """
    AI tarafından verilen ipuçları için temel alanlar.
    """
    hint_text: str
    user_feedback: Optional[str] = None

class AIHintCreate(AIHintBase):
    """
    Yeni ipucu oluşturma şeması.
    """
    pass

class AIHintUpdate(BaseModel):
    """
    AI ipucunu güncelleme şeması.
    """
    hint_text: Optional[str] = None
    user_feedback: Optional[str] = None

class AIHintOut(AIHintBase):
    """
    API yanıtı için çıkış şeması.
    """
    id: int
    date: date
    created_at: datetime

    class Config:
        orm_mode = True
