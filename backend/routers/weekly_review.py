from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Annotated
from backend.database import get_db
from backend.schemas.weekly_review import WeeklyReviewCreate, WeeklyReviewOut
from backend.crud.weekly_review import create_weekly_review
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/weekly-reviews", tags=["Weekly Reviews"])
user_dep = Annotated[dict, Depends(get_current_user)]

@router.post("/", response_model=WeeklyReviewOut)
def add_review(review_in: WeeklyReviewCreate, user: user_dep, db: Session = Depends(get_db)):
    """
    Haftalık değerlendirme ekler.

    Args:
        review_in (WeeklyReviewCreate): Değerlendirme içeriği.
        user (dict): Giriş yapmış kullanıcı.
        db (Session): Veritabanı bağlantısı.

    Returns:
        WeeklyReviewOut: Kaydedilen değerlendirme verisi.
    """
    return create_weekly_review(db, user["id"], review_in)
