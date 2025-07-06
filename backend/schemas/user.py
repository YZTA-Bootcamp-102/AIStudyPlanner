from pydantic import BaseModel, EmailStr, constr, Field
from typing import Optional
from enum import Enum

# Kullanıcı rolleri
class UserRoleEnum(str, Enum):
    kullanıcı = "kullanıcı"
    yönetici = "yönetici"

# Ortak alanlar
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    phone_number: Optional[str] = Field(None, max_length=15)
    role: UserRoleEnum = UserRoleEnum.kullanıcı

# Yeni kullanıcı oluşturmak için şema
class UserCreate(UserBase):
    password: constr(min_length=8)

# Güncelleme işlemleri için şema
class UserUpdate(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    username: Optional[str]
    email: Optional[EmailStr]
    phone_number: Optional[str]
    role: Optional[UserRoleEnum]
    old_password: Optional[constr(min_length=8)]
    new_password: Optional[constr(min_length=8)]

# Kullanıcı verisi dışa aktarımı
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str]
    role: UserRoleEnum
    is_active: bool

    class Config:
        orm_mode = True  # SQLAlchemy modelini otomatik eşleştir
