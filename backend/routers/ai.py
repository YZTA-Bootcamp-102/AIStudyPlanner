from alembic.util import status
from fastapi import APIRouter, Depends, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.routers.auth import oauth2_scheme
from backend.schemas.learning import LearningGoalCreate, LearningGoalOut, LearningModuleOut
from backend.crud import learning as crud_learning
from backend.services.ai_service import generate_learning_modules
from backend.services.auth_service import get_current_user
from typing import Annotated
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/ai", tags=["AI"],dependencies=[Depends(oauth2_scheme)])
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/set-goal", response_model=LearningGoalOut)
def set_goal(user: user_dependency,goal: LearningGoalCreate, db: Session = Depends(get_db), user_id: int = 1):
    """
    Kullanıcının öğrenme hedefini oluşturur.
    """
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("user_id")
    return crud_learning.create_goal(db, user_id, goal)

@router.post("/generate-modules", response_model=list[LearningModuleOut])
def generate_modules(user: user_dependency,goal: LearningGoalCreate, db: Session = Depends(get_db), user_id: int = 1):
    """
    AI destekli öğrenme modülleri önerir ve veritabanına kaydeder.
    """
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user_id = user.get("user_id")
    modules = generate_learning_modules(goal.goal_text, goal.interest_areas, goal.current_knowledge_level)
    return crud_learning.create_modules_for_user(db, user_id, modules)
