from pydantic import BaseModel
from datetime import datetime

class AIConversationCreate(BaseModel):
    """
    Yeni AI konuşması başlatmak için istek verisi.
    """
    learning_goal_id: int
    user_input: str

class AIConversationOut(AIConversationCreate):
    """
    API'den dönen AI konuşma verisi.
    """
    id: int
    ai_response: str
    timestamp: datetime

    class Config:
        orm_mode = True
