from sqlalchemy.orm import Session
from backend.models.ai_tip import UserActivity, AITip
from backend.schemas.ai_tip import UserActivityCreate, AITipCreate

def log_user_activity(db: Session, user_id: int, data: UserActivityCreate):
    activity = UserActivity(user_id=user_id, **data.dict())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

def create_ai_tip(db: Session, user_id: int, tip_data: AITipCreate):
    tip = AITip(user_id=user_id, **tip_data.dict())
    db.add(tip)
    db.commit()
    db.refresh(tip)
    return tip

def update_tip_feedback(db: Session, tip_id: int, feedback: str, is_applied: bool):
    tip = db.query(AITip).get(tip_id)
    if tip:
        tip.feedback = feedback
        tip.is_applied = is_applied
        tip.shown_at = datetime.utcnow()
        db.commit()
        db.refresh(tip)
    return tip
