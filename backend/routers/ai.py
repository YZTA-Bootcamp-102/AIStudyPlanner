from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from types import SimpleNamespace
from backend.database import get_db
from backend.services.auth_service import get_current_user
from backend.schemas.learning import LearningGoalCreate, LearningGoalOut, LearningModuleOut
from backend.schemas.progress import ProgressOut
from backend.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderOut
from backend.crud import learning as crud_learning
from backend.crud.progress import get_progress
from backend.crud.reminder import get_reminder_by_id
from backend.services.ai_service import generate_learning_modules
from backend.services.auth_service import authenticate_user, send_password_reset_email
from starlette import status
from fastapi.security import OAuth2PasswordBearer

# AI endpoint'leri
router = APIRouter(prefix="/ai", tags=["AI"])
user_dep = Depends(get_current_user)

@router.post("/set-goal", response_model=LearningGoalOut)
def set_goal(goal: LearningGoalCreate, user=Depends(get_current_user), db=Depends(get_db)):
    """Kullanıcının yeni öğrenme hedefini oluşturur."""
    return crud_learning.create_goal(db, user["user_id"], goal)

@router.post("/generate-modules", response_model=list[LearningModuleOut])
def generate_modules(goal_id: int = Query(...), user=Depends(get_current_user), db=Depends(get_db)):
    """Mevcut hedef ID’siyle AI destekli modüller üretir."""
    goal = crud_learning.get_goal_by_id(db, user["user_id"], goal_id)
    if not goal:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Hedef bulunamadı")
    modules = generate_learning_modules(goal.goal_text, goal.interest_areas, goal.current_knowledge_level)
    return crud_learning.create_modules_for_user(db, user["user_id"], modules)



