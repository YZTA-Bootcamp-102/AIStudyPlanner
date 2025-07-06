from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base

class CalendarIntegration(Base):
    """
        Kullanıcının takvim entegrasyonlarını temsil eder (örneğin Google Calendar).

        Alanlar:
            id: Entegrasyon ID'si.
            user_id: İlgili kullanıcı.
            provider: Takvim sağlayıcısı (örn. Google, Outlook).
            calendar_id: Entegre edilen takvimin ID'si.
            sync_token: Eşitleme için kullanılan token.
            created_at: Oluşturulma tarihi.
            updated_at: Güncellenme tarihi.

        İlişkiler:
            user: Entegrasyonun ait olduğu kullanıcı.
    """

    __tablename__ = 'calendar_integrations'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    provider = Column(String(50), nullable=False)
    calendar_id = Column(String(100), nullable=False)
    sync_token = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="calendar_integration")
