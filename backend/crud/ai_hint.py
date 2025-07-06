from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List, Optional
from backend.models.ai_hint import AIHint
from backend.schemas.ai_hint import AIHintCreate, AIHintUpdate
from backend.services.ai_hint_service import generate_ai_hint


def create_ai_hint(db: Session, user_id: int, hint_in: AIHintCreate) -> AIHint:
    """
    Yeni AI ipucu oluşturur.
    """
    hint = AIHint(user_id=user_id, **hint_in.dict())
    db.add(hint); db.commit(); db.refresh(hint)
    return hint

def get_hints_by_user(db: Session, user_id: int, for_date: Optional[date] = None) -> List[AIHint]:
    """
    Kullanıcının belirli bir tarihteki ya da tüm AI ipuçlarını getirir.
    """
    q = db.query(AIHint).filter(AIHint.user_id == user_id)
    if for_date:
        q = q.filter(AIHint.date == for_date)
    return q.all()

def update_ai_hint(db: Session, hint_id: int, user_id: int, hint_upd: AIHintUpdate) -> Optional[AIHint]:
    """
    Belirli bir AI ipucunu günceller.
    """
    hint = db.query(AIHint).filter(AIHint.id==hint_id, AIHint.user_id==user_id).first()
    if not hint:
        return None
    for k, v in hint_upd.dict(exclude_unset=True).items():
        setattr(hint, k, v)
    db.commit(); db.refresh(hint)
    return hint
def create_ai_hint_for_user(db: Session, user_id: int, goal_text: str, level: str) -> AIHint:
    hint_text = generate_ai_hint(goal_text, level)

    hint = AIHint(
        user_id=user_id,
        date=date.today(),
        hint_text=hint_text,
        created_at=datetime.utcnow()
    )

    db.add(hint)
    db.commit()
    db.refresh(hint)

    return hint
