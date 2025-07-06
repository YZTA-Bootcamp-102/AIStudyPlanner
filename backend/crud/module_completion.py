from sqlalchemy.orm import Session
from typing import Optional

from backend.models import LearningModule
from backend.models.module_completion import ModuleCompletion

def mark_module_complete(db: Session, user_id: int, module_id: int) -> ModuleCompletion:
    mc = ModuleCompletion(user_id=user_id, module_id=module_id)
    db.add(mc); db.commit(); db.refresh(mc)
    return mc

def count_user_completions(db: Session, user_id: int) -> int:
    return db.query(ModuleCompletion).filter(ModuleCompletion.user_id == user_id).count()

def get_user_completion_rate(db: Session, user_id: int) -> float:
    total = db.query(LearningModule).count()
    completed = count_user_completions(db, user_id)
    return (completed / total * 100) if total else 0.0
