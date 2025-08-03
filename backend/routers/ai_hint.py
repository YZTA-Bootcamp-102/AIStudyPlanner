from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database import get_db
from backend.services.auth_service import get_current_user
from backend.schemas.ai_hint import AIHintCreate, AIHintUpdate, AIHintOut
from backend.crud.ai_hint import (
    create_ai_hint, get_hints_by_user,
    update_ai_hint, create_ai_hint_for_user
)

router = APIRouter(prefix="/ai/hints", tags=["AI Hints"])

@router.post("/", response_model=AIHintOut)
def post_hint(
    hint_in: AIHintCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    hint = create_ai_hint(db, user["user_id"], hint_in)
    return hint

@router.get("/", response_model=List[AIHintOut])
def list_hints(
    for_date: Optional[str] = Query(None, description="YYYY‑MM‑DD"),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    date_filter = None
    if for_date:
        try:
            from datetime import datetime
            date_filter = datetime.strptime(for_date, "%Y-%m-%d").date()
        except:
            raise HTTPException(status_code=400, detail="Invalid date format")
    return get_hints_by_user(db, user["user_id"], date_filter)

@router.put("/{hint_id}", response_model=AIHintOut)
def patch_hint(
    hint_id: int,
    hint_upd: AIHintUpdate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    updated = update_ai_hint(db, hint_id, user["user_id"], hint_upd)
    if not updated:
        raise HTTPException(status_code=404, detail="Hint not found")
    return updated

@router.post("/generate", response_model=AIHintOut)
def generate_hint(
    goal_text: str = Query(...),
    level: str = Query(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Günlük otomatik AI ipucu üretimi için.
    """
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    hint = create_ai_hint_for_user(db, user["user_id"], goal_text, level)
    return hint
