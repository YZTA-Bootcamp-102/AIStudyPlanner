from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class ModuleCompletion(Base):
    """
    Kullanıcının modül tamamlama bilgilerini tutar.
    """
    __tablename__ = 'module_completions'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True, nullable=False)
    module_id = Column(Integer, ForeignKey('learning_modules.id'), index=True, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="module_completions")
    module = relationship("LearningModule")
