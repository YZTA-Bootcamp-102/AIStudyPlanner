from celery import Celery
import os

from celery.schedules import crontab

# Celery uygulaması tanımlanır
celery_app = Celery(
    "backend",
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_RESULT_BACKEND"),
)
celery_app.autodiscover_tasks()
# Beat ile periyodik görev planlaması (her 60 saniyede bir çalışır)
celery_app.conf.beat_schedule = {
    "check-and-send-reminders-every-minute": {
        "task": "backend.celery_tasks.reminder_tasks.check_and_send_reminders",
        "schedule": crontab(minute=0, hour=8, day_of_week="monday"),
        "args": (),
    },
    "weekly-check-reminders": {
        "task": "backend.tasks.reminder_tasks.check_reminders",
        "schedule": crontab(day_of_week="*", hour=7, minute=0),
        "args": (),
    }
}
