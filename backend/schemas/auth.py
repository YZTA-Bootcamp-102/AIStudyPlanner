from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str]
    role: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    username: Optional[str]
    email: Optional[EmailStr]
    phone_number: Optional[str]
    role: Optional[str]
    old_password: Optional[str]
    new_password: Optional[str]

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetForm(BaseModel):
    reset_code: str
    new_password: str
