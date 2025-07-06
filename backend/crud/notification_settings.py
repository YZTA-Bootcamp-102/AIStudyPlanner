from sqlalchemy.orm import Session
from backend.models.notification_settings import NotificationSettings

def get_settings(db: Session, user_id: int) -> NotificationSettings:
    return db.query(NotificationSettings).filter(NotificationSettings.user_id==user_id).first()

def upsert_settings(db: Session, user_id: int, enable_email: bool, enable_push: bool, lead_time_minutes: int):
    settings = get_settings(db, user_id)
    if settings:
        settings.enable_email = enable_email
        settings.enable_push = enable_push
        settings.lead_time_minutes = lead_time_minutes
    else:
        settings = NotificationSettings(user_id=user_id, enable_email=enable_email, enable_push=enable_push, lead_time_minutes=lead_time_minutes)
        db.add(settings)
    db.commit(); db.refresh(settings)
    return settings
