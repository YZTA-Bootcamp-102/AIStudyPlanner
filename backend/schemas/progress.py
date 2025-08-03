from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ProgressOut(BaseModel):
    """
    Kullanıcının ilerleme durumunu taşıyan API çıktısı şeması.
    """
    id: int
    completed_tasks: int
    total_tasks: int
    cumulative_score: int
    badges: List[str]
    week: int
    month: int
    year: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True