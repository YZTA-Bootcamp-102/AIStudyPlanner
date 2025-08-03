from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.services.auth_service import get_current_user
from backend.schemas.ai_tip import *
from backend.crud.ai_tip import *

router = APIRouter(prefix="/ai-tips", tags=["AI Tips"])

@router.post("/activity", response_model=UserActivityOut)
def log_activity(data: UserActivityCreate, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return log_user_activity(db, user["id"], data)

@router.post("/", response_model=AITipOut)
def add_ai_tip(tip: AITipCreate, user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return create_ai_tip(db, user["id"], tip)

@router.put("/{tip_id}/feedback", response_model=AITipOut)
def set_feedback(tip_id: int, feedback: str, is_applied: bool, db: Session = Depends(get_db)):
    return update_tip_feedback(db, tip_id, feedback, is_applied)
