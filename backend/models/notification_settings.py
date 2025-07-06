
from sqlalchemy import Column, Integer, Boolean, Integer, ForeignKey
from backend.database import Base

class NotificationSettings(Base):
    """
    Kullanıcının bildirim tercihlerini tutar.
    """
    __tablename__ = 'notification_settings'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, index=True)
    enable_email = Column(Boolean, default=True, nullable=False)
    enable_push = Column(Boolean, default=True, nullable=False)
    lead_time_minutes = Column(Integer, default=60, nullable=False)
