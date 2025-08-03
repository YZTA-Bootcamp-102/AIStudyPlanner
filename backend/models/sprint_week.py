from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class SprintWeek(Base):
    __tablename__ = 'sprint_weeks'

    id = Column(Integer, primary_key=True)
    sprint_plan_id = Column(Integer, ForeignKey('sprint_plans.id'), nullable=False)
    week_number = Column(Integer, nullable=False)
    daily_minutes = Column(Integer, nullable=False)
    topics = Column(Text, nullable=False)  # JSON string veya newline-separated

    sprint_plan = relationship("SprintPlan", back_populates="weeks")
