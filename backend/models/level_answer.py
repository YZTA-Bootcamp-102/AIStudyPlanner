from sqlalchemy import Column, Integer, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base
from backend.models.enums import OptionKey

class LevelAnswer(Base):
    """
    Kullanıcının seviye testi için verdiği cevapları temsil eder.

    Alanlar:
        id: Cevap ID'si.
        user_id: Cevabı veren kullanıcı.
        question_id: İlgili soru.
        learning_goal_id: İlgili öğrenme hedefi.
        selected_option: Seçilen cevap.
        timestamp: Cevaplama zamanı.

    İlişkiler:
        user, question, learning_goal
    """

    __tablename__ = 'level_answers'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    question_id = Column(Integer, ForeignKey('level_questions.id'), index=True)
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'), index=True)
    selected_option = Column(Enum(OptionKey, native_enum=False), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="level_answers")
    question = relationship("LevelQuestion", back_populates="answers")
    learning_goal = relationship("LearningGoal", back_populates="level_answers")