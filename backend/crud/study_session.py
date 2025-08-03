from sqlalchemy.orm import Session
from backend.models.study_session import StudySession
from backend.schemas.study_session import StudySessionCreate

# Yeni çalışma oturumu oluşturur
def create_session(db: Session, user_id: int, session_in: StudySessionCreate):
    sess = StudySession(user_id=user_id, **session_in.dict(exclude_unset=True))
    db.add(sess)
    db.commit()
    db.refresh(sess)
    return sess
