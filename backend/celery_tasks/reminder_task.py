from celery import shared_task
from sqlalchemy.orm import Session
from datetime import datetime

from backend.crud.reminder import get_pending, mark_as_sent
from backend.database import SessionLocal
from backend.models import Reminder
from backend.models.enums import NotificationMethod
from backend.utils.email import send_email_notification
from backend.utils.push.push_sender import send_push_notification
import logging

@shared_task(name="check_and_send_reminders")
def check_and_send_reminders():
    """
    Celery görevi olarak tanımlanır. Her çalıştığında:
    - Gönderilmemiş ve zamanı gelmiş hatırlatmaları bulur.
    - E-posta veya push bildirimi yollar.
    - Başarıyla gönderilenleri `sent=1` olarak işaretler.
    """
    db: Session = SessionLocal()
    now = datetime.utcnow()

    try:
        reminders = db.query(Reminder).filter(
            Reminder.sent == 0,
            Reminder.notify_time <= now
        ).all()

        if not reminders:
            logging.info("[Reminder Task] Gönderilecek hatırlatma yok.")
            return

        for reminder in reminders:
            try:
                if reminder.method.value == "email":
                    send_email_notification(reminder)
                elif reminder.method.value == "push":
                    send_push_notification(reminder)
                else:
                    logging.warning(f"[Reminder Task] Tanımsız bildirim türü: {reminder.method}")

                reminder.sent = 1
                db.add(reminder)

            except Exception as inner_error:
                logging.error(f"[Reminder Task] Hatırlatma gönderiminde hata: {inner_error}")

        db.commit()
        logging.info(f"[Reminder Task] {len(reminders)} hatırlatma başarıyla işlendi.")

    except Exception as e:
        logging.exception(f"[Reminder Task] Genel hata: {e}")
        db.rollback()
    finally:
        db.close()

@shared_task
def check_reminders():
    db = SessionLocal()
    pending = get_pending(db, datetime.utcnow())
    for rem in pending:
        if rem.method == NotificationMethod.EMAIL:
            send_email_notification(rem)
        else:
            send_push_notification(rem)
        mark_as_sent(db, rem.id)
    db.close()