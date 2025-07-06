from fastapi import APIRouter, Depends, HTTPException
from backend.crud.notification_settings import get_settings, upsert_settings
from backend.schemas.notification_settings import NotificationSettingsOut, NotificationSettingsIn
from backend.services.auth_service import get_current_user
from backend.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/notification-settings", tags=["Notification Settings"])

@router.get("/", response_model=NotificationSettingsOut)
def read_settings(user = Depends(get_current_user), db: Session = Depends(get_db)):
    s = get_settings(db, user['user_id'])
    if not s:
        raise HTTPException(404, detail="No settings found.")
    return s

@router.post("/", response_model=NotificationSettingsOut)
def update_settings(data: NotificationSettingsIn, user = Depends(get_current_user), db: Session = Depends(get_db)):
    return upsert_settings(db, user['user_id'], data.enable_email, data.enable_push, data.lead_time_minutes)
