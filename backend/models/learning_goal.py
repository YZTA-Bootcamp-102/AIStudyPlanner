from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, date

from backend.database import Base

class LearningGoal(Base):
    """
    Kullanıcının belirlediği öğrenme hedeflerini temsil eder.

    Alanlar:
        id: Hedefin benzersiz ID'si.
        user_id: Hedefin bağlı olduğu kullanıcı.
        goal_text: Hedefin içeriği.
        interest_areas: Kullanıcının ilgi alanları.
        current_knowledge_level: Bilgi seviyesi.
        start_date: Başlangıç tarihi.
        target_end_date: Bitmesi hedeflenen tarih.
        is_active: Aktiflik durumu.
        is_achieved: Hedefin başarıyla tamamlanıp tamamlanmadığı.
        created_at, updated_at: Oluşturulma ve güncellenme zamanları.

    İlişkiler:
        user, learning_modules, study_sessions, ai_conversations,
        daily_tasks, level_answers
    """


    __tablename__ = 'learning_goals'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    title = Column(String(200))
    goal_text = Column(Text, nullable=False)
    interest_areas = Column(String(200))
    current_knowledge_level = Column(String(50))
    start_date = Column(Date, default=date.today, nullable=False)
    target_end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True)
    is_achieved = Column(Boolean, default=False)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="learning_goals")
    daily_tasks = relationship("DailyTask", back_populates="learning_goal")
    learning_modules = relationship("LearningModule", back_populates="learning_goal")
    study_sessions = relationship("StudySession", back_populates="learning_goal")
    ai_conversations = relationship("AIConversation", back_populates="learning_goal")
    level_answers = relationship("LevelAnswer", back_populates="learning_goal")