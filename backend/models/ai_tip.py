from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class UserActivity(Base):
    __tablename__ = "user_activities"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    activity_date = Column(DateTime, default=datetime.utcnow)
    minutes_focused = Column(Integer, nullable=False)
    notes = Column(Text)

    user = relationship("User", back_populates="activities")


class AITip(Base):
    __tablename__ = "ai_tips"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    tip_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    shown_at = Column(DateTime)
    feedback = Column(Text)  # örnek: "Uyguladım", "İlginç değil"
    is_applied = Column(Boolean, default=False)

    user = relationship("User", back_populates="ai_tips")
