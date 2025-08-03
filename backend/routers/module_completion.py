from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.services.ai_feedback import get_motivation_message
from backend.services.auth_service import get_current_user
from backend.crud.module_completion import mark_module_complete, get_user_completion_rate
from backend.schemas.common import CompletionOut, CompletionRateOut

router = APIRouter(prefix="/completions", tags=["Module Completions"])

@router.post("/{module_id}", response_model=CompletionOut)
def complete_module(module_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    return mark_module_complete(db, user["user_id"], module_id)


@router.get("/rate", response_model=CompletionRateOut, summary="Kullanıcının modül tamamlama ilerleme oranını alır")
def completion_rate(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    - Kullanıcının tamamladığı modül oranını hesaplar.
    - Bu orana uygun motivasyon mesajı döner.
    """
    user_id = user["user_id"]
    rate = get_user_completion_rate(db, user_id)
    title, message = get_motivation_message(rate)
    return {"rate": rate, "title": title, "message": message}
