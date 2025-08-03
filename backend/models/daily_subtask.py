from sqlalchemy import Column, Integer,Text, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class DailySubtask(Base):
    __tablename__ = 'daily_subtasks'

    id = Column(Integer, primary_key=True)
    daily_task_id = Column(Integer, ForeignKey('daily_tasks.id'), nullable=False)
    text = Column(Text, nullable=False)
    done = Column(Boolean, default=False)

    daily_task = relationship("DailyTask", back_populates="subtasks")
