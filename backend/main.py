from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers.auth import router as auth_router
from routers.calendar import router as calendar_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AI Study Planner API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hoşgeldiniz, API çalışıyor!"}

app.include_router(auth_router)
app.include_router(calendar_router)

Base.metadata.create_all(bind=engine)
