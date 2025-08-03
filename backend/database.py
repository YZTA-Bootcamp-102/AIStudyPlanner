import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# .env dosyasındaki ortam değişkenlerini yükler
load_dotenv()

# Ortam değişkeninden veritabanı bağlantı adresi alınır
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found. Check your .env file.")

# SQLAlchemy Engine oluşturulur
engine = create_engine(DATABASE_URL)

# SessionLocal, her istek için yeni bir oturum (session) sağlar
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Tüm modellerin türetileceği Base sınıfı
Base = declarative_base()

# FastAPI bağımlılık sistemi ile kullanılmak üzere veritabanı oturumu üretici
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
