from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, Time, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import ARRAY, Enum
from backend.database import Base
from backend.models.enums import CategoryType, RepeatType, PriorityType


class DailyTask(Base):
    """
    Kullanıcıya atanmış günlük görevleri temsil eder.

    Alanlar:
        id: Görev ID'si.
        user_id: Görevin ait olduğu kullanıcı.
        learning_goal_id: İlgili öğrenme hedefi.
        title: Görev başlığı.
        description: Görev açıklaması.
        date: Görevin yapılacağı tarih.
        start_time: Başlangıç saati.
        duration_minutes: Süresi (dakika).
        is_completed: Görev tamamlandı mı?
        calendar_event_id: Takvim etkinliği ID'si.
        created_at, updated_at: Zaman bilgileri.

    İlişkiler:
        user, learning_goal, reminders: Bu göreve bağlı hatırlatmalar.
    """

    __tablename__ = 'daily_tasks'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'), nullable=True)
    title = Column(String)
    description = Column(Text)
    date = Column(Date, index=True, nullable=False)
    start_time = Column(Time)
    duration_minutes = Column(Integer)
    is_completed = Column(Boolean, default=False)
    calendar_event_id = Column(String(100))

    category = Column(Enum(CategoryType), default=CategoryType.other)
    tags = Column(ARRAY(String), default=[])
    repeat = Column(Enum(RepeatType), default=RepeatType.none)
    custom_repeat = Column(String, nullable=True)
    priority = Column(Enum(PriorityType), default=PriorityType.medium)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="daily_tasks")
    learning_goal = relationship("LearningGoal", back_populates="daily_tasks")
    reminders = relationship("Reminder", back_populates="task")
    subtasks = relationship("DailySubtask", back_populates="daily_task", cascade="all, delete-orphan")
    notes = relationship("DailyNote", back_populates="daily_task", cascade="all, delete-orphan")
