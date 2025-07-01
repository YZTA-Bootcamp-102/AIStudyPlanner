from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers.auth import router as auth_router
import os


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
Base.metadata.create_all(bind=engine)