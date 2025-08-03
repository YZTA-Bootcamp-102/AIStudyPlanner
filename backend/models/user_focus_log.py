from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class UserFocusLog(Base):
    __tablename__ = "user_focus_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    focus_minutes = Column(Integer, default=0)
    tip_feedback = Column(String, nullable=True)
