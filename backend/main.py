from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from backend.database import engine
from backend.models import Base
from backend.routers.auth import router as auth_router
from backend.routers import auth, tasks, modules, sprint, calendar, ai

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
app.include_router(tasks.router)
app.include_router(modules.router)
app.include_router(sprint.router)
app.include_router(calendar.router)
app.include_router(ai.router)
# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)
