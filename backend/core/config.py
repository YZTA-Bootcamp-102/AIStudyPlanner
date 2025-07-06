import os
from dotenv import load_dotenv

# .env dosyasını yükler
load_dotenv()


class Settings:
    """
    Uygulama ayarlarını tutan sınıf.
    Ortam değişkenlerinden yüklenir.
    """
    # JWT ile kimlik doğrulama ayarları
    SECRET_KEY: str = os.getenv("SECRET_KEY", "defaultsecret")
    REFRESH_SECRET_KEY: str = os.getenv("REFRESH_SECRET_KEY", "refreshsecret")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

    # E-posta gönderimi için SMTP ayarları
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "localhost")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SENDER_EMAIL: str = os.getenv("SENDER_EMAIL", "noreply@example.com")
    SENDER_PASSWORD: str = os.getenv("SENDER_PASSWORD", "")

    # Uygulama genel ayarları
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "My FastAPI App")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")


# Ayarları import eden modüller için instance
settings = Settings()
