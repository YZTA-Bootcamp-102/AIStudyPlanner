from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, date

from backend.database import Base

class AIHint(Base):
    """
    Kullanıcıya yapay zeka tarafından verilen ipuçlarını temsil eder.

    Alanlar:
        id: İpucunun benzersiz ID'si.
        user_id: İlgili kullanıcı ID'si.
        date: İpucunun verildiği tarih.
        hint_text: AI tarafından sağlanan ipucu metni.
        user_feedback: Kullanıcının ipucu hakkında verdiği geri bildirim.
        created_at: Oluşturulma tarihi.

    İlişkiler:
        user: Bu ipucunun ait olduğu kullanıcı.
    """

    __tablename__ = 'ai_hints'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    date = Column(Date, default=date.today, nullable=False)
    hint_text = Column(Text, nullable=False)
    user_feedback = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="ai_hints")