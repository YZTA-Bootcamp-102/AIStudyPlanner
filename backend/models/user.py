from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timedelta, timezone

from backend.database import Base
from backend.models.enums import UserRole

def default_expiry():
    return datetime.now(timezone.utc) + timedelta(hours=1)

class User(Base):
    """
    Sistemdeki kullanıcıları temsil eder.

    Alanlar:
        id: Kullanıcının benzersiz ID'si.
        email: Kullanıcının e-posta adresi.
        username: Kullanıcının kullanıcı adı.
        device_token: Push bildirimleri için cihaz token'ı.
        push_enabled: Push bildirimleri açık mı.
        first_name, last_name: Kullanıcının adı ve soyadı.
        hashed_password: Şifre hashlenmiş olarak saklanır.
        is_active: Kullanıcının aktiflik durumu.
        role: Kullanıcı rolü (USER, ADMIN, vs.).
        reset_code: Şifre sıfırlamak için geçici kod.
        reset_code_expiry: Kodun geçerlilik süresi.
        phone_number: Telefon numarası.
        created_at, updated_at: Oluşturulma ve güncellenme zamanları.

    İlişkiler:
        learning_modules, daily_tasks, progress, ai_hints, sprint_plans,
        calendar_integration, weekly_reviews, learning_goals, study_sessions,
        mindmap_nodes, ai_conversations, level_answers
    """


    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    device_token = Column(String, nullable=True)
    push_enabled = Column(Boolean, default=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole, native_enum=True), default=UserRole.USER)
    reset_code = Column(String, nullable=True)
    reset_code_expiry = Column(DateTime(timezone=True), default=default_expiry, nullable=True)
    phone_number = Column(String)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())

    # Relationships
    learning_modules = relationship("LearningModule", back_populates="user")
    daily_tasks = relationship("DailyTask", back_populates="user")
    progress = relationship("Progress", back_populates="user")
    ai_hints = relationship("AIHint", back_populates="user")
    sprint_plans = relationship("SprintPlan", back_populates="user")
    calendar_integration = relationship("CalendarIntegration", back_populates="user")
    weekly_reviews = relationship("WeeklyReview", back_populates="user")
    learning_goals = relationship("LearningGoal", back_populates="user")
    study_sessions = relationship("StudySession", back_populates="user")
    mindmap_nodes = relationship("MindmapNode", back_populates="user")
    ai_conversations = relationship("AIConversation", back_populates="user")
    level_answers = relationship("LevelAnswer", back_populates="user")
    module_completions = relationship("ModuleCompletion", back_populates="user")