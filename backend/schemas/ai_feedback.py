from pydantic import BaseModel
from datetime import datetime

class AIFeedbackCreate(BaseModel):
    feedback_text: str
    ai_response: str

class AIFeedbackUpdate(BaseModel):
    user_rating: int | None = None
    is_helpful: bool | None = None

class AIFeedbackOut(AIFeedbackCreate, AIFeedbackUpdate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
