from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.enums import NotificationMethod
from backend.schemas.reminder import ReminderCreateOut
from backend.utils.push.push_sender import send_push_notification
from backend.crud.reminder import get_reminder_by_id, create_reminder
from backend.services.auth_service import get_current_user

from starlette import status



# Reminder endpoint'
router = APIRouter(prefix="/reminder", tags=["Reminder"])

@router.post("/reminders/{reminder_id}/send")
async def send_reminder(
    reminder_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)

   ):
    """Belirli bir hatırlatmayı arka planda push bildirim olarak gönderir."""
    reminder = get_reminder_by_id(db, reminder_id)
    if not reminder:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Reminder bulunamadı.")
    background_tasks.add_task(send_push_notification, reminder)
    return {"message": "Bildirim gönderilecek şekilde planlandı."}

@router.post("/", response_model=ReminderCreateOut)
def add_reminder(task_id: int, offset_minutes: int = 60,
                 method: NotificationMethod = NotificationMethod.PUSH,
                 message: str = None,
                 db = Depends(get_db),
                 user = Depends(get_current_user)):
    """
    Göreve bağlı hatırlatma ekler.
    offset_minutes örn. '60' = görev başlangıcından 1 saat önce.
    """
    rem = create_reminder(db, task_id, timedelta(minutes=offset_minutes), method, message)
    if not rem:
        raise HTTPException(404, "Görev bulunamadı")
    return rem