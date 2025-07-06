from datetime import timedelta
from fastapi import HTTPException, status

from backend.models import User
from backend.core.config import settings
from backend.core.security import create_token, decode_token

def create_access_token(user: User, expires_delta: timedelta | None = None) -> str:
    """
    Giriş yapan kullanıcı için access token üretir.
    """
    expires = expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    data = _build_payload(user)
    return create_token(data, settings.SECRET_KEY, expires)

def create_refresh_token(user: User, expires_delta: timedelta | None = None) -> str:
    """
    Giriş yapan kullanıcı için refresh token üretir.
    """
    expires = expires_delta or timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    data = _build_payload(user)
    return create_token(data, settings.REFRESH_SECRET_KEY, expires)

def verify_access_token(token: str) -> dict:
    """
    Access token'ı doğrular.
    """
    payload = decode_token(token, settings.SECRET_KEY)
    _validate_token_payload(payload, is_refresh=False)
    return payload

def verify_refresh_token(token: str) -> dict:
    """
    Refresh token'ı doğrular.
    """
    payload = decode_token(token, settings.REFRESH_SECRET_KEY)
    _validate_token_payload(payload, is_refresh=True)
    return payload

def _build_payload(user: User) -> dict:
    """
    Token içine gömülecek kullanıcı bilgilerini hazırlar.
    """
    return {
        "sub": user.username,
        "user_id": user.id,
        "role": user.role.value,
        "email": user.email,
        "first_name": user.first_name,
    }

def _validate_token_payload(payload: dict, is_refresh: bool = False):
    """
    Token içeriğinin geçerli olup olmadığını kontrol eder.
    """
    if not payload.get("sub") or not payload.get("user_id"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload" if not is_refresh else "Invalid refresh token",
        )
