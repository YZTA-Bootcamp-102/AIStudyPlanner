from sqlalchemy.orm import Session
from backend.models.level_question import LevelQuestion, LevelQuestionOption
from backend.models.level_answer import LevelAnswer
from backend.schemas.level import LevelAnswerCreate

# Tüm seviye belirleme sorularını ve şıklarını döner
def list_questions(db: Session):
    q = db.query(LevelQuestion).all()
    return [{
        "id": q.id,
        "topic": q.topic,
        "question_text": q.question_text,
        "options": [opt.option_key.value for opt in q.options],
        "created_at": q.created_at
    }]

# Kullanıcının cevapladığı soruyu veritabanına kaydeder
def create_answer(db: Session, user_id: int, ans_in: LevelAnswerCreate):
    ans = LevelAnswer(user_id=user_id, **ans_in.dict())
    db.add(ans)
    db.commit()
    db.refresh(ans)
    return ans
