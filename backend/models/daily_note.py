from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class DailyNote(Base):
    __tablename__ = 'daily_notes'

    id = Column(Integer, primary_key=True)
    daily_task_id = Column(Integer, ForeignKey('daily_tasks.id'), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    daily_task = relationship("DailyTask", back_populates="notes")

