import os
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import string
import random
from backend.models import User

# .env dosyasındaki ortam değişkenlerini yükler
load_dotenv()

# Ortamdan gelen gizli anahtar ve algoritma bilgileri
SECRET_KEY = os.getenv("SECRET_KEY", "defaultsecret")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY", "refreshsecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
oauth_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")
# Şifre hash'leme için bcrypt algoritması kullanılır
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def generate_reset_code(length=12):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def get_password_hash(password: str) -> str:
    """
    Şifreyi hash'ler (bcrypt algoritması ile).
    """
    return bcrypt_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Düz metin şifreyi hash ile karşılaştırır.
    """
    return bcrypt_context.verify(plain, hashed)


def create_token(data: dict, expires_delta: timedelta, secret_key: str) -> str:
    """
    JWT token üretir.
    - data: token içine yerleştirilecek veriler (payload).
    - expires_delta: token ne kadar süreyle geçerli olacak.
    """
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + expires_delta
    return jwt.encode(payload, secret_key, algorithm=ALGORITHM)


def create_access_token(user: User, expires_delta: timedelta | None = None) -> str:
    """
    Kullanıcı için erişim (access) token üretir.
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    data = {
        "sub": user.username,
        "user_id": user.id,
        "role": user.role,
        "email": user.email,
        "first_name": user.first_name
    }
    return create_token(data, expires_delta, SECRET_KEY)


def create_refresh_token(user: User, expires_delta: timedelta | None = None) -> str:
    """
    Kullanıcı için yenileme (refresh) token üretir.
    """
    if expires_delta is None:
        expires_delta = timedelta(days=7)

    data = {
        "sub": user.username,
        "user_id": user.id,
        "role": user.role,
        "email": user.email,
        "first_name": user.first_name
    }
    return create_token(data, expires_delta, REFRESH_SECRET_KEY)


def authenticate_user(username: str, password: str, db: Session) -> User | None:
    """
    Kullanıcı adı ve şifreyi doğrular.
    - Doğruysa kullanıcı nesnesini döner.
    - Yanlışsa None döner.
    """
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def verify_access_token(token: str) -> dict:
    """
    Access token'ı çözümler, geçerliyse içeriğini döner.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if not payload.get("sub") or not payload.get("user_id"):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token payload")
        return payload
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token is invalid")


def verify_refresh_token(token: str) -> dict:
    """
    Refresh token'ı çözümler, geçerliyse içeriğini döner.
    """
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        if not payload.get("sub") or not payload.get("user_id"):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
        return payload
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token is invalid")


def authenticate_user(username: str, password: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    if not user or not bcrypt_context.verify(password, user.hashed_password):
        return None
    return user

def get_current_user(token: str = Depends(oauth_bearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "username": payload.get("sub"),
            "user_id": payload.get("user.id"),
            "role": payload.get("role")
        }
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


