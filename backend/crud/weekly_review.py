from sqlalchemy.orm import Session
from backend.models.weekly_review import WeeklyReview
from backend.schemas.weekly_review import WeeklyReviewCreate

# Haftalık değerlendirme kaydı oluşturur
def create_weekly_review(db: Session, user_id: int, review_in: WeeklyReviewCreate):
    rev = WeeklyReview(user_id=user_id, **review_in.dict())
    db.add(rev)
    db.commit()
    db.refresh(rev)
    return rev
