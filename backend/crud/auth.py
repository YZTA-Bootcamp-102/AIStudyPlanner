from datetime import datetime

from sqlalchemy.orm import Session
from backend.models import User
from backend.schemas.auth import UserCreate,UserUpdate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    user = User(
        username=user_in.username,
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        phone_number=user_in.phone_number,
        role=user_in.role,
        password_hash=pwd_context.hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db: Session, db_user: User, user_in: UserUpdate) -> User:
    data = user_in.dict(exclude_unset=True)
    if user_in.old_password and user_in.new_password:
        if not pwd_context.verify(user_in.old_password, db_user.password_hash):
            raise ValueError("Old password is incorrect")
        data["password_hash"] = pwd_context.hash(user_in.new_password)
    for field, value in data.items():
        setattr(db_user, field, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, db_user: User) -> None:
    db.delete(db_user)
    db.commit()

def set_reset_code(db: Session, user: User, code: str, expiry: datetime):
    user.reset_code = code
    user.reset_code_expiry = expiry
    db.commit()
    db.refresh(user)
    return user
