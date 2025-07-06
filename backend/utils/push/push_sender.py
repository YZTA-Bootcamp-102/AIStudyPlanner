import os
import logging
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, messaging

load_dotenv()

# Firebase admin uygulaması başlatılır
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

def send_push_notification(reminder):
    """
    Firebase üzerinden push bildirimi gönderir.

    Args:
        reminder: Reminder modeli örneği (ilgili görev ve kullanıcıya erişir).
    """
    try:
        user = reminder.task.user
        title = f"Görev Hatırlatma: {reminder.task.title}"
        message_body = reminder.message or f"{reminder.task.title} göreviniz yaklaşıyor!"

        device_token = user.device_token
        if not device_token:
            logging.warning(f"[PUSH WARNING] {user.firstname} cihaz token'ı yok.")
            return

        message = messaging.Message(
            notification=messaging.Notification(title=title, body=message_body),
            token=device_token,
        )

        response = messaging.send(message)
        logging.info(f"[PUSH] Başarılı gönderim: {response}")

    except Exception as e:
        logging.error(f"[PUSH ERROR] Push bildirimi gönderilemedi: {e}")
