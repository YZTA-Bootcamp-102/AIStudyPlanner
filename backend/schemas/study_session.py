from pydantic import BaseModel
from datetime import date, datetime
from backend.models.enums import TreeStage
from typing import Optional

# Yeni çalışma oturumu oluşturma için giriş şeması
class StudySessionCreate(BaseModel):
    learning_goal_id: int                  # Hangi öğrenme hedefine ait olduğu
    duration_minutes: int                  # Çalışma süresi (dakika)
    date: Optional[date] = None            # Oturum tarihi (varsayılan: bugün)
    growth_stage: Optional[TreeStage] = None  # O günkü gelişim aşaması (opsiyonel)

# Çalışma oturumunu dönerken kullanılan çıkış şeması
class StudySessionOut(StudySessionCreate):
    id: int                                # Oturumun ID’si
    user_id: int                           # Kullanıcının ID’si
    created_at: datetime                   # Oluşturulma zamanı

    class Config:
        orm_mode = True
