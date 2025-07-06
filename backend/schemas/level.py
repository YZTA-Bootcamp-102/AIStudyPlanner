from pydantic import BaseModel
from datetime import datetime
from typing import List
from backend.models.enums import OptionKey

# Seviye belirleme sorusunu dışa aktarmak için şema
class LevelQuestionOut(BaseModel):
    id: int                              # Soru ID’si
    topic: str                           # Konu başlığı
    question_text: str                   # Soru metni
    options: List[str]                   # Şıklar
    created_at: datetime                 # Oluşturulma tarihi

    class Config:
        orm_mode = True

# Kullanıcının verdiği cevabı oluşturmak için giriş şeması
class LevelAnswerCreate(BaseModel):
    question_id: int                     # Cevaplanan soru ID’si
    learning_goal_id: int                # İlgili öğrenme hedefi
    selected_option: OptionKey           # Seçilen seçenek (Enum)

# Verilen cevabı dönerken kullanılan çıkış şeması
class LevelAnswerOut(LevelAnswerCreate):
    id: int                              # Cevabın ID’si
    timestamp: datetime                  # Cevaplama zamanı

    class Config:
        orm_mode = True
