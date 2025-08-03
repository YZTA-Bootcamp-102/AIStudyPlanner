from pydantic import BaseModel
from datetime import datetime

class CompletionOut(BaseModel):
    id: int
    user_id: int
    module_id: int
    completed_at: datetime
    class Config:
        orm_mode = True

class CompletionRateOut(BaseModel):
    """
    Kullanıcı için ilerleme oranı ve motivasyon mesajı içeren çıktı şeması.
    """
    rate: float
    title: str
    message: str

    class Config:
        schema_extra = {
            "example": {
                "rate": 72.5,
                "title": "🎯 Çok İyi!",
                "message": "Harika iş çıkarıyorsun — biraz daha artırsan tamamlarsın."
            }
        }
