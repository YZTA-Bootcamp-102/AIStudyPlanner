from pydantic import BaseModel

class NotificationSettingsIn(BaseModel):
    enable_email: bool
    enable_push: bool
    lead_time_minutes: int

class NotificationSettingsOut(NotificationSettingsIn):
    id: int
    class Config:
        orm_mode = True
