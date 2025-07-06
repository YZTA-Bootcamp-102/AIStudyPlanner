from sqlalchemy import Column, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base

class Progress(Base):
    """
    Kullanıcının ilerleme bilgilerini temsil eder.

    Alanlar:
        id: İlerleme ID'si.
        user_id: Kullanıcı ID'si.
        completed_tasks: Tamamlanan görev sayısı.
        total_tasks: Toplam görev sayısı.
        cumulative_score: Toplam puan.
        badges: Alınan rozetler (JSON).
        week, month, year: İlgili zaman periyotları.
        created_at, updated_at: Zaman bilgileri.

    İlişkiler:
        user
    """

    __tablename__ = 'progress'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    completed_tasks = Column(Integer)
    total_tasks = Column(Integer)
    cumulative_score = Column(Integer, default=0)
    badges = Column(JSON)
    week = Column(Integer, index=True)
    month = Column(Integer, index=True)
    year = Column(Integer, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress")