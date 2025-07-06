from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, date

from backend.database import Base
from backend.models.enums import TreeStage

class StudySession(Base):
    """
    Kullanıcının yaptığı çalışma oturumlarını temsil eder.

    Alanlar:
        id: Oturum ID'si.
        user_id: Kullanıcı ID'si.
        learning_goal_id: İlgili öğrenme hedefi.
        duration_minutes: Süre (dakika).
        date: Oturum tarihi.
        growth_stage: Öğrenme aşaması (örn. SEED, GROWTH).
        created_at: Zaman bilgisi.

    İlişkiler:
        user, learning_goal
    """

    __tablename__ = 'study_sessions'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'), index=True)
    duration_minutes = Column(Integer, nullable=False)
    date = Column(Date, default=date.today, index=True)
    growth_stage = Column(Enum(TreeStage, native_enum=False), default=TreeStage.SEED)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="study_sessions")
    learning_goal = relationship("LearningGoal", back_populates="study_sessions")