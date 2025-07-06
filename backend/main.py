from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from backend.database import engine
from backend.models import Base
from backend.routers.auth import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router ekle
app.include_router(auth_router)

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)
