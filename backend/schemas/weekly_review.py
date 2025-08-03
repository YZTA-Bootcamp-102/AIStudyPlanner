from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Haftalık değerlendirme oluşturma için giriş şeması
class WeeklyReviewCreate(BaseModel):
    week_number: int                      # Haftanın numarası (1-52)
    year: int                             # Yıl
    strengths: Optional[str] = None       # Güçlü yönler (opsiyonel)
    improvement_areas: Optional[str] = None  # Geliştirilecek alanlar (opsiyonel)
    comparison_with_previous: Optional[str] = None  # Önceki haftaya göre karşılaştırma

# Haftalık değerlendirme çıkışı
class WeeklyReviewOut(WeeklyReviewCreate):
    id: int                               # Değerlendirmenin ID’si
    created_at: datetime                  # Oluşturulma tarihi

    class Config:
        orm_mode = True
