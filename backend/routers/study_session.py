from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Annotated
from backend.database import get_db
from backend.schemas.study_session import StudySessionCreate, StudySessionOut
from backend.crud.study_session import create_session
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/study-sessions", tags=["Study Sessions"])
user_dep = Annotated[dict, Depends(get_current_user)]

# Yeni bir çalışma oturumu ekler
@router.post("/", response_model=StudySessionOut)
def add_session(session_in: StudySessionCreate, user: user_dep, db: Session = Depends(get_db)):
    return create_session(db, user["id"], session_in)
