from datetime import datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.models import User
from backend.schemas.user import UserCreate, UserUpdate
from backend.core.security import verify_password, get_password_hash

def get_user_by_username(db: Session, username: str) -> User | None:
    """Kullanıcı adından kullanıcıyı getirir"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> User | None:
    """E-postaya göre kullanıcıyı getirir"""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    """Yeni kullanıcı oluşturur"""
    user = User(
        username=user_in.username,
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        phone_number=user_in.phone_number,
        role=user_in.role,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db: Session, db_user: User, user_in: UserUpdate) -> User:
    """Kullanıcı bilgilerini günceller (şifre dahil)"""
    data = user_in.dict(exclude_unset=True)

    if user_in.old_password and user_in.new_password:
        if not verify_password(user_in.old_password, db_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mevcut şifre hatalı"
            )
    # (devamı eklenmeli: yeni şifre set edilmesi vb.)

def set_reset_code(db: Session, user: User, code: str, expiry: datetime) -> None:
    """Şifre sıfırlama kodu ve süresi belirler"""
    user.reset_code = code
    user.reset_code_expiry = expiry
    db.commit()

def get_user_by_reset_code(db: Session, code: str) -> User | None:
    """Reset koduna göre kullanıcıyı bulur"""
    return db.query(User).filter(User.reset_code == code).first()

def update_user_password(db: Session, user: User, hashed_password: str) -> None:
    """Kullanıcının şifresini değiştirir"""
    user.hashed_password = hashed_password
    user.reset_code = None
    user.reset_code_expiry = None
