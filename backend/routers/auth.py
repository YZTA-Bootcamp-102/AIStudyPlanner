from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from starlette import status
from jose import jwt, JWTError
from backend.services.auth_service import (
    authenticate_user, create_access_token, create_refresh_token,
    verify_access_token, verify_refresh_token, get_password_hash
)
from backend.database import get_db
from backend.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Yeni kullanıcı kaydı
@router.post("/", status_code=status.HTTP_201_CREATED)
def register_user(
    firstname: str = Form(...),
    lastname: str = Form(...),
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    phone_number: str | None = Form(None),
    db: Session = Depends(get_db)
):
    """
    Yeni kullanıcı kaydı yapar.
    - Aynı kullanıcı adı veya email varsa hata verir.
    """
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Username already exists")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already exists")

    # Kullanıcı nesnesi oluşturuluyor
    user = User(
        firstname=firstname,
        lastname=lastname,
        username=username,
        email=email,
        phone_number=phone_number,
        role=role,
        is_active=True,
        password_hash=get_password_hash(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"user_id": user.user_id, "email": user.email}


# Giriş yapıp access/refresh token alma
@router.post("/token", response_model=dict)
def login_user(
    username: str = Form(...),
    password: str = Form(...),
    remember_me: bool = Form(False),
    db: Session = Depends(get_db)
):
    """
    Kullanıcı giriş yapar.
    - Şifre doğrulanır.
    - Access ve refresh token döner.
    """
    user = authenticate_user(username, password, db)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect username or password")

    access_delta = timedelta(days=7) if remember_me else timedelta(minutes=60)
    refresh_delta = timedelta(days=30) if remember_me else timedelta(days=7)

    return {
        "access_token": create_access_token(user, expires_delta=access_delta),
        "refresh_token": create_refresh_token(user, expires_delta=refresh_delta),
        "token_type": "bearer"
    }


# Refresh token ile yeni access token alma
@router.post("/refresh", response_model=dict)
def refresh_token(refresh_token: str = Form(...)):
    """
    Refresh token ile yeni access token üretir.
    - Refresh token doğrulanır.
    """
    payload = verify_refresh_token(refresh_token)

    # Burada kullanıcıyı tekrar DB'den çekmek gerekebilir.
    dummy_user = type("U", (), payload)
    new_access = create_access_token(dummy_user, timedelta(minutes=60))

    return {
        "access_token": new_access,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


# Access token ile oturum açmış kullanıcının bilgilerini getirir
@router.get("/me")
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Geçerli access token'dan kullanıcı bilgisi getirir.
    """
    payload = verify_access_token(token)
    user = db.query(User).filter(User.user_id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return {
        "user_id": user.user_id,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role,
        "is_active": user.is_active
    }

