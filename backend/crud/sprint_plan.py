from sqlalchemy.orm import Session
from backend.models.sprint_plan import SprintPlan
from backend.schemas.sprint_plan import SprintPlanCreate

# Yeni bir sprint planı oluşturur
def create_plan(db: Session, user_id: int, sp_in: SprintPlanCreate):
    sp = SprintPlan(user_id=user_id, **sp_in.dict())
    db.add(sp)
    db.commit()
    db.refresh(sp)
    return sp

# Kullanıcının tüm sprint planlarını listeler
def list_plans(db: Session, user_id: int):
    return db.query(SprintPlan).filter(SprintPlan.user_id == user_id).all()
