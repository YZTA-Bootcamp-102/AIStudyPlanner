from sqlalchemy import Column, Integer, Text, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base

class SprintPlan(Base):
    """
    Belirli bir zaman aralığı için yapılan sprint planını temsil eder.

    Alanlar:
        id: Plan ID'si.
        user_id: Kullanıcı ID'si.
        learning_goal_id: İlgili öğrenme hedefi.
        start_date, end_date: Sprint başlangıç ve bitiş tarihleri.
        objectives: Hedeflenen çıktılar.
        summary: Özet bilgi.
        created_at, updated_at: Oluşturulma ve güncellenme tarihleri.

    İlişkiler:
        user
    """

    __tablename__ = 'sprint_plans'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True, nullable=False)
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'), index=True, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    objectives = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="sprint_plans")
    weeks = relationship("SprintWeek", back_populates="sprint_plan", cascade="all, delete-orphan")
