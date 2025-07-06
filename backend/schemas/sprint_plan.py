from pydantic import BaseModel
from datetime import date, datetime

# Yeni sprint planı oluşturmak için kullanılan giriş şeması
class SprintPlanCreate(BaseModel):
    learning_goal_id: int  # İlişkili öğrenme hedefinin ID'si
    start_date: date       # Sprint başlangıç tarihi
    end_date: date         # Sprint bitiş tarihi
    objectives: str        # Sprint boyunca ulaşılmak istenen hedefler

# Sprint planını dönerken kullanılan çıkış şeması
class SprintPlanOut(SprintPlanCreate):
    id: int                            # Sprint planının benzersiz ID’si
    summary: str | None                # (Opsiyonel) Sprint özeti
    created_at: datetime               # Oluşturulma tarihi
    updated_at: datetime               # Güncellenme tarihi

    class Config:
        orm_mode = True               # SQLAlchemy nesneleri ile uyumlu dönüş
