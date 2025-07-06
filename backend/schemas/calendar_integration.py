from pydantic import BaseModel
from datetime import datetime

class CalendarIntegrationCreate(BaseModel):
    """
    Takvim entegrasyonu oluşturmak veya güncellemek için.
    """
    provider: str
    calendar_id: str
    sync_token: str | None = None

class CalendarIntegrationOut(CalendarIntegrationCreate):
    """
    API'den dönen takvim entegrasyon verisi.
    """
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
