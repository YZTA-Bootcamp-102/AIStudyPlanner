import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from backend.core.config import settings
from backend.utils.email.email_renderer import render_template

def send_email(to_email: str, subject: str, template_name: str, context: dict):
    """
    Verilen bilgilere göre e-posta gönderir.

    Args:
        to_email (str): Alıcının e-posta adresi.
        subject (str): E-posta konusu.
        template_name (str): Kullanılacak HTML template dosyası.
        context (dict): Şablonda yer alacak içerikler.
    """
    html_content = render_template(template_name, context)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SENDER_EMAIL
    msg["To"] = to_email

    msg.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SENDER_EMAIL, settings.SENDER_PASSWORD)
            server.sendmail(settings.SENDER_EMAIL, [to_email], msg.as_string())
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
