from backend.utils.email.email_sender import send_email

def send_email_notification(reminder):
    """
    Hatırlatma nesnesine göre e-posta gönderir.

    Args:
        reminder: Reminder modeli örneği (ilgili görev ve kullanıcıya erişir).
    """
    user = reminder.task.user
    context = {
        "user_name": user.firstname or "Kullanıcı",
        "task_title": reminder.task.title,
        "task_time": reminder.task.start_time.strftime("%d.%m.%Y %H:%M"),
        "message": reminder.message or "Görevinizi zamanında yapmayı unutmayın!"
    }

    send_email(
        to_email=user.email,
        subject=f"Görev Hatırlatma: {reminder.task.title}",
        template_name="email/reminder.html",
        context=context
    )
