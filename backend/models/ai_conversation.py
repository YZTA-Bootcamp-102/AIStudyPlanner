from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base

class AIConversation(Base):
    """
    Kullanıcı ile yapay zeka arasındaki konuşma geçmişlerini temsil eder.

    Alanlar:
        id: Konuşma ID'si.
        user_id: Kullanıcı ID'si.
        learning_goal_id: Bağlı olduğu öğrenme hedefi.
        user_input: Kullanıcının girdiği mesaj.
        ai_response: AI cevabı.
        timestamp: Zaman bilgisi.

    İlişkiler:
        user, learning_goal
    """

    __tablename__ = 'ai_conversations'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'), index=True)
    user_input = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="ai_conversations")
    learning_goal = relationship("LearningGoal", back_populates="ai_conversations")