from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from backend.models.enums import NotificationMethod

class LearningGoalCreate(BaseModel):
    """
    Kullanıcının öğrenme hedefi oluşturma isteğinde göndereceği veriler.
    """
    goal_text: str                      # Öğrenme hedefi açıklaması
    title: str
    interest_areas: str                 # İlgi alanları listesi/metni
    current_knowledge_level: str       # Bilgi seviyesi (başlangıç, orta, ileri …)
    start_date: datetime               # Hedefin başlama tarihi
    target_end_date: datetime          # Tahmini tamamlanma tarihi

class LearningGoalOut(LearningGoalCreate):
    """
    Veritabanından dönen öğrenme hedefi nesnesine genişletilmiş şema.
    """
    id: int                             # Hedefin benzersiz kimliği

    class Config:
        orm_mode = True
        from_attributes = True

# Öğrenme modülü oluşturma isteği için şema
class LearningModuleCreate(BaseModel):
    """
    Yeni öğrenme modülü verisi (iş başvurusu/istek olarak).
    """
    title: str
    description: str
    category: str
    order: int
    learning_outcome: str

class LearningModuleOut(LearningModuleCreate):
    """
    SQLAlchemy'den dönen öğrenme modülü verisi.
    """
    id: int
    progress: Optional[int] = 0
    created_at: datetime
    class Config:
        orm_mode  = True
        from_attributes = True

