from pydantic import BaseModel, EmailStr, constr

# JWT token dönerken kullanılan model
class TokenResponse(BaseModel):
    access_token: str                  # Erişim token'ı (JWT)
    refresh_token: str                 # Yenileme token'ı
    token_type: str = "bearer"         # Token türü (varsayılan: bearer)

# Şifre sıfırlama talebi için email alanı
class PasswordResetRequest(BaseModel):
    email: EmailStr                    # Kullanıcının kayıtlı email adresi

# Şifre sıfırlama formu (frontend'den gelir)
class PasswordResetForm(BaseModel):
    reset_code: str                    # Kullanıcıya gönderilen sıfırlama kodu
    new_password: constr(min_length=8) # Yeni şifre (min. 8 karakter)
class RefreshTokenRequest(BaseModel):
    refresh_token: str
