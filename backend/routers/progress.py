from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Annotated, Optional

from backend.database import get_db
from backend.schemas.progress import ProgressOut
from backend.crud.progress import get_progress
from backend.services.auth_service import get_current_user


# Progress endpoint'
router = APIRouter(prefix="/progress", tags=["Progress"])
@router.get("/", response_model=list[ProgressOut], summary="Kullanıcı ilerleme verilerini getirir")
def read_progress(week: Optional[int] = None,
                  month: Optional[int] = None,
                  year: Optional[int] = None,
                  user: dict = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    """Kullanıcının ilerlemesini filtreli olarak listeler."""
    return get_progress(db, user["user_id"], week, month, year)