from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Annotated
from backend.database import get_db
from backend.schemas.sprint_plan import SprintPlanCreate, SprintPlanOut
from backend.crud.sprint_plan import create_plan, list_plans
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/sprint-plans", tags=["Sprint Plans"])
user_dep = Annotated[dict, Depends(get_current_user)]

@router.post("/", response_model=SprintPlanOut)
def add_plan(sp_in: SprintPlanCreate, user: user_dep, db: Session = Depends(get_db)):
    """
    Yeni sprint planı ekler.

    Args:
        sp_in (SprintPlanCreate): Sprint planı verisi.
        user (dict): Aktif kullanıcı.
        db (Session): Veritabanı oturumu.

    Returns:
        SprintPlanOut: Oluşturulan sprint planı.
    """
    return create_plan(db, user["id"], sp_in)

@router.get("/", response_model=List[SprintPlanOut])
def get_plans(user: user_dep, db: Session = Depends(get_db)):
    """
    Kullanıcının tüm sprint planlarını getirir.

    Args:
        user (dict): Aktif kullanıcı.
        db (Session): Veritabanı oturumu.

    Returns:
        List[SprintPlanOut]: Kullanıcının tüm sprint planları.
    """
    return list_plans(db, user["id"])
