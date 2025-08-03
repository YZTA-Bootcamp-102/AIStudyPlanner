from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.user import UserOut
from backend.services.auth_service import get_current_user
from backend.schemas.learning import LearningGoalCreate, LearningGoalOut, LearningModuleOut
from backend.crud import learning as crud_learning
from backend.services.ai_service import generate_learning_modules, generate_study_plan_from_answers
from backend.models import User
from backend.schemas.learning import LearningModuleCreate
from starlette import status
from backend.schemas.learning import LearningModuleOut
from pydantic import BaseModel
from backend.models.learning_module import LearningModule
from backend.services.ai_service import generate_ai_response
from backend.models.learning_goal import LearningGoal


from typing import Optional
router = APIRouter(prefix="/ai", tags=["AI"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str


class StudyPlanRequest(BaseModel):
    plan_id: str
    answers: dict

class StudyPlanResponse(BaseModel):
    plan_text: str

@router.post("/set-goal", response_model=LearningGoalOut)
def set_goal(
    goal: LearningGoalCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Kullanıcının yeni öğrenme hedefini oluşturur."""
    return crud_learning.create_goal(db, user.id, goal)


@router.post("/generate-modules", response_model=list[LearningModuleOut])
def generate_modules(
    background_tasks: BackgroundTasks,
    goal_id: int = Query(..., description="Hedef ID'si"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """AI modülleri arka planda üretir, önceki modülleri döner."""
    goal = crud_learning.get_goal_by_id(db, user.id, goal_id)
    if not goal:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Hedef bulunamadı")

    # Modül üretimini arka plana al
    background_tasks.add_task(
        crud_learning.generate_and_save_modules,
        db, user.id, goal
    )

    # Şu an varsa önceki modülleri dön (kullanıcı beklemesin)
    existing_modules = crud_learning.get_modules_by_goal_id(db, user.id, goal_id)
    return [LearningModuleOut.from_orm(m) for m in existing_modules]

@router.get("/goals", response_model=list[LearningGoalOut])
def list_goals(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return crud_learning.get_all_goals_by_user(db, user.id)

from fastapi import HTTPException, status

@router.delete("/goals/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    success = crud_learning.delete_goal(db, user.id, goal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Hedef bulunamadı")

@router.put("/goals/{goal_id}", response_model=LearningGoalOut)
def update_goal(
    goal_id: int,
    goal_data: LearningGoalCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    updated = crud_learning.update_goal(db, user.id, goal_id, goal_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Hedef bulunamadı")
    return updated

@router.get("/goals/{goal_id}/modules", response_model=list[LearningModuleOut])
def get_modules_by_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    modules = crud_learning.get_modules_by_goal_id(db, user.id, goal_id)
    return modules

@router.get("/goals/{goal_id}", response_model=LearningGoalOut)
def get_goal_detail(
    goal_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Belirli bir hedefin detaylarını döner.
    """
    goal = crud_learning.get_goal_by_id(db, user.id, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Hedef bulunamadı")
    return goal

@router.put("/modules/{module_id}", response_model=LearningModuleOut)
def update_module(
    module_id: int,
    module_data: LearningModuleCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Belirli bir modülü günceller.
    """
    updated = crud_learning.update_module(db, user.id, module_id, module_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Modül bulunamadı")
    return updated

@router.delete("/modules/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_module(
    module_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Belirli bir modülü siler.
    """
    module = db.query(LearningModule).filter_by(id=module_id, user_id=user.id).first()
    if not module:
        return False
    db.delete(module)
    db.commit()
    return True
@router.get("/modules/{module_id}", response_model=LearningModuleOut)
def get_module_detail(
    module_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Belirli bir modülün detaylarını getirir.
    """
    module = crud_learning.get_module_by_id(db, user.id, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Modül bulunamadı")
    return module



def orm_to_schema(module) -> LearningModuleOut:
    progress_value = getattr(module, "progress", 0)
    created_at_value = getattr(module, "created_at", None) or datetime.utcnow()

    module_dict = LearningModuleOut.from_orm(module).dict()
    module_dict['progress'] = progress_value
    module_dict['created_at'] = created_at_value

    return LearningModuleOut(**module_dict)


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    try:
        reply = generate_ai_response(request.message)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/generate-study-plan", response_model=StudyPlanResponse)
async def generate_study_plan(request: StudyPlanRequest):
    """
    Kullanıcının verdiği cevaplara göre AI destekli çalışma planı oluşturur.
    """
    try:
        ai_plan = generate_study_plan_from_answers(request.plan_id, request.answers)
        return {"plan_text": ai_plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/", response_model=LearningModuleCreate, status_code=status.HTTP_201_CREATED)
def create_learning_module(
    module_data: LearningModuleCreate,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user),
):
    """
    Yeni bir öğrenme modülü oluşturur.
    """

    # İlgili hedefin kullanıcıya ait olup olmadığını kontrol et
    goal = db.query(LearningGoal).filter_by(id=module_data.learning_goal_id, user_id=current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Learning goal not found or does not belong to the user.")

    module = LearningModule(
        title=module_data.title,
        description=module_data.description,
        category=module_data.category,
        order=module_data.order,
        learning_outcome=module_data.learning_outcome,
        user_id=current_user.id,
        learning_goal_id=module_data.learning_goal_id,
    )

    db.add(module)
    db.commit()
    db.refresh(module)