from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class CalendarIntegration(Base):
    """
    Kullanıcının takvim entegrasyonlarını temsil eder (örn. Google Calendar).

    Alanlar:
        id: Entegrasyon ID'si.
        user_id: İlgili kullanıcı.
        provider: Takvim sağlayıcısı (Google, Outlook vb).
        calendar_id: Takvim ID'si.
        sync_token: Eşitleme token'ı.
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
