from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from starlette import status
from datetime import timedelta
from types import SimpleNamespace

from backend.core.security import get_password_hash
from backend.core.config import settings
from backend.database import get_db
from backend.models.enums import UserRole
from backend.schemas.auth import TokenResponse, PasswordResetRequest, PasswordResetForm, RefreshTokenRequest
from backend.schemas.user import UserOut
from backend.models import User
from backend.services.auth_service import reset_password_with_code, get_current_user
from backend.services.auth_service import authenticate_user, send_password_reset_email
from backend.services.token_service import (
    create_access_token,
    create_refresh_token,
    verify_access_token,
    verify_refresh_token,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

@router.post("/", status_code=status.HTTP_201_CREATED)
def register_user(
    first_name: str = Form(...),
    last_name: str = Form(...),
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    phone_number: str | None = Form(None),
    db: Session = Depends(get_db),
):
    """
    Yeni kullanıcı kaydı. Aynı username/email varsa hata verir.
    """
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        phone_number=phone_number,
        role=UserRole(role.lower()),
        is_active=True,
        hashed_password=get_password_hash(password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"user_id": new_user.id, "email": new_user.email}

@router.post("/token", response_model=TokenResponse)
def login_user(
    username: str = Form(...),
    password: str = Form(...),
    remember_me: bool = Form(False),
    db: Session = Depends(get_db),
):
    """
    Kullanıcı giriş işlemi. Doğru bilgilerle JWT token döner.
    """
    user = authenticate_user(username, password, db)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    access_expires = timedelta(days=7) if remember_me else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_expires = timedelta(days=30) if remember_me else timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    return TokenResponse(
        access_token=create_access_token(user, access_expires),
        refresh_token=create_refresh_token(user, refresh_expires),
        token_type="bearer"
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(data: RefreshTokenRequest):
    payload = verify_refresh_token(data.refresh_token)

    dummy_user = SimpleNamespace(
        username=payload["sub"],
        id=payload["user_id"],
        role=UserRole(payload["role"]),
        email=payload["email"],
        first_name=payload["first_name"]
    )

    new_access_token = create_access_token(dummy_user, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=data.refresh_token,
        token_type="bearer"
    )

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/password-reset")
def password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    E-posta adresine şifre sıfırlama kodu gönderir.
    """
    send_password_reset_email(db, request.email)
    return {"message": "Şifre sıfırlama kodu e-posta adresinize gönderildi."}

@router.put("/change-password", status_code=200)
def reset_password(data: PasswordResetForm, db: Session = Depends(get_db)):
    """
    Reset kodu ile yeni şifre belirleme.
    """
    try:
        reset_password_with_code(db, data.reset_code, data.new_password)
        return {"message": "Şifre başarıyla güncellendi"}
    except HTTPException as e:
        raise e
