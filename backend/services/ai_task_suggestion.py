from typing import List
from backend.models.daily_task import DailyTask
from backend.models.module_completion import ModuleCompletion
from backend.models.learning_goal import LearningGoal
from backend.models.learning_module import LearningModule
from sqlalchemy.orm import Session

def suggest_tasks_for_user(db: Session, user_id: int) -> List[str]:
    """
    Kullanıcının öğrenme hedefi ve tamamlamadığı modüllere göre görev önerir.
    """
    completed_module_ids = db.query(ModuleCompletion.module_id).filter_by(user_id=user_id).subquery()
    # Henüz tamamlanmamış modüller
    modules = db.query(LearningModule).filter(~LearningModule.id.in_(completed_module_ids)).limit(5).all()

    suggestions = []
    for m in modules:
        suggestions.append(f"{m.title} modülüne başla.")
    return suggestions
