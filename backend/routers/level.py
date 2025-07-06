from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Annotated
from backend.database import get_db
from backend.schemas.level import LevelQuestionOut, LevelAnswerCreate, LevelAnswerOut
from backend.crud.level import list_questions, create_answer
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/level", tags=["Level"])
user_dep = Annotated[dict, Depends(get_current_user)]

@router.get("/questions", response_model=List[LevelQuestionOut])
def get_questions(db: Session = Depends(get_db)):
    """
    Tüm seviye belirleme sorularını getirir.

    Returns:
        List[LevelQuestionOut]: Tüm sorular ve şıkları.
    """
    return list_questions(db)

@router.post("/answers", response_model=LevelAnswerOut)
def post_answer(ans_in: LevelAnswerCreate, user: user_dep, db: Session = Depends(get_db)):
    """
    Kullanıcının soruya verdiği cevabı kaydeder.

    Args:
        ans_in (LevelAnswerCreate): Soruya verilen cevap.
        user (dict): Giriş yapmış kullanıcı.
        db (Session): Veritabanı oturumu.

    Returns:
        LevelAnswerOut: Kaydedilen cevap bilgisi.
    """
    return create_answer(db, user["id"], ans_in)

