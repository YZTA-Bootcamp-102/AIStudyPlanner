from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from database import engine
from models import Base 
from routers.auth import router as auth_router
from routers.calendar import router as calendar_router
from dotenv import load_dotenv
from routers import weekly_stats 
load_dotenv()

app = FastAPI(
    title="AI Study Planner API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """API'nin ana dizinine hoş geldiniz mesajı."""
    return {"message": "Hoşgeldiniz, API çalışıyor!"}

# Router'ları uygulamaya dahil et
app.include_router(auth_router)
app.include_router(calendar_router)
app.include_router(weekly_stats.router)

Base.metadata.create_all(bind=engine)
