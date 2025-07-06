import string
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from backend.models import User
from backend.core.security import verify_password, get_password_hash
from backend.services.token_service import verify_access_token
from backend.utils.email.email_sender import send_email
from backend.crud.auth import (
    get_user_by_email,
    get_user_by_reset_code,
    set_reset_code,
    update_user_password,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def authenticate_user(username: str, password: str, db: Session) -> User | None:
    """
    Kullanıcı adı ve şifre doğrulama işlemini yapar.
    """
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def generate_reset_code(length: int = 12) -> str:
    """
    Rastgele şifre sıfırlama kodu üretir.
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    JWT token ile gelen kullanıcıyı çözümler.
    """
    try:
        payload = verify_access_token(token)
        return {
            "username": payload.get("sub"),
            "user_id": payload.get("user_id"),
            "role": payload.get("role"),
            "email": payload.get("email"),
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

def send_password_reset_email(db: Session, email: str):
    """
    Kullanıcının e-posta adresine şifre sıfırlama kodu gönderir.
    """
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Daha önce gönderilmiş aktif kod varsa tekrar gönderilmez
    if user.reset_code and user.reset_code_expiry and datetime.now(timezone.utc) < user.reset_code_expiry:
        raise HTTPException(status_code=429, detail="Reset code already sent. Please check your email.")

    code = generate_reset_code()
    expiry = datetime.now(timezone.utc) + timedelta(minutes=15)

    set_reset_code(db, user, code, expiry)

    send_email(
        to_email=user.email,
        subject="Şifre Sıfırlama Kodu",
        template_name="reset_password.html",
        context={"username": user.first_name, "reset_code": code}
    )

def reset_password_with_code(db: Session, reset_code: str, new_password: str):
    """
    Kod doğrulamasıyla şifreyi günceller.
    """
    user = get_user_by_reset_code(db, reset_code)
    if not user or not user.reset_code_expiry or datetime.now(timezone.utc) > user.reset_code_expiry:
        raise HTTPException(status_code=400, detail="Invalid or expired reset code")
    hashed_password = get_password_hash(new_password)
    update_user_password(db, user, hashed_password)
    db.commit()
