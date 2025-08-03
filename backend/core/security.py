from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import HTTPException, status
from backend.core.config import settings

# Şifreleme algoritması (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Düz metin şifreyi hash'ler"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Kullanıcıdan gelen şifreyi hashlenmiş olanla karşılaştırır"""
    return pwd_context.verify(plain_password, hashed_password)

def create_token(data: dict, secret_key: str, expires_delta: timedelta) -> str:
    """Verilen kullanıcı bilgileriyle JWT token üretir"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=settings.ALGORITHM)

def decode_token(token: str, secret_key: str) -> dict:
    """Token'ı decode eder, geçersizse hata fırlatır"""
    try:
        return jwt.decode(token, secret_key, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz token"
        )
