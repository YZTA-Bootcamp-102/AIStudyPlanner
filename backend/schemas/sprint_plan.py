from pydantic import BaseModel
from typing import List
from datetime import date, datetime

# Yeni sprint planı oluşturmak için kullanılan giriş şeması
class SprintPlanCreate(BaseModel):
    learning_goal_id: int
    start_date: date
    end_date: date
    objectives: str

# Sprint planını dönerken kullanılan çıkış şeması
class SprintPlanOut(SprintPlanCreate):
    id: int
    summary: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 için gerekli

# Gemini için istek şeması
class SprintRequest(BaseModel):
    topic: str
    level: str
    daily_minutes: int
    duration_weeks: int

# Her haftaya ait sprint detayları
class WeeklySprint(BaseModel):
    week_number: int
    topics: List[str]
    daily_minutes: int

# Gemini'den dönen tüm sprint planı
class SprintResponse(BaseModel):
    weeks: List[WeeklySprint]

class WeeklySprint(BaseModel):
    week_number: int
    topics: List[str]
    daily_minutes: int

class SprintPlanFullOut(SprintPlanOut):
    weeks: List[WeeklySprint]
