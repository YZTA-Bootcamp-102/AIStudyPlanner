from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.services.auth_service import get_current_user
from backend.database import get_db
from backend.services.ai_task_suggestion import suggest_tasks_for_user

router = APIRouter(prefix="/task-suggestions", tags=["AI Suggestions"])

@router.get("/", summary="AI ile görev önerisi")
def suggest(user = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = user["user_id"]
    suggestions = suggest_tasks_for_user(db, user_id)
    return {"suggestions": suggestions}
