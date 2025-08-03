from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base

class LearningModule(Base):
    """
    Bir öğrenme hedefi kapsamında oluşturulan modülleri temsil eder.

    Alanlar:
        id: Modül ID'si.
        user_id: Modülü oluşturan kullanıcı.
        learning_goal_id: Bağlı olduğu öğrenme hedefi.
        title: Başlık.
        description: Açıklama.
        category: Kategori (örn. konu adı).
        order: Modül sırası.
        learning_outcome: Beklenen öğrenme çıktısı.
        created_at, updated_at: Oluşturulma ve güncellenme zamanları.

    İlişkiler:
        user, learning_goal
    """

    __tablename__ = 'learning_modules'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'), index=True)
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    order = Column(Integer)
    learning_outcome = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="learning_modules")
    learning_goal = relationship("LearningGoal", back_populates="learning_modules")