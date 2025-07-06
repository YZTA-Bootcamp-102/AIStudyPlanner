from datetime import datetime

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from backend.database import Base
from backend.models.enums import NotificationMethod

class Reminder(Base):
    """
    Görevler için oluşturulan hatırlatmaları temsil eder.

    Alanlar:
        id: Hatırlatma ID'si.
        task_id: İlgili görev ID'si.
        notify_time: Bildirim zamanı.
        method: Bildirim yöntemi (örn. PUSH).
        message: Bildirim mesajı.
        sent: Gönderim durumu (0: gönderilmedi, 1: gönderildi).
        created_at: Oluşturulma zamanı.

    İlişkiler:
        task
    """

    __tablename__ = 'reminders'

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('daily_tasks.id'),nullable=False)
    notify_time = Column(DateTime, nullable=False)
    method = Column(Enum(NotificationMethod, native_enum=False), default=NotificationMethod.PUSH)
    message = Column(Text)
    sent = Column(Integer, default=0)# 0 = gönderilmedi, 1 = gönderildi
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    task = relationship("DailyTask", back_populates="reminders")