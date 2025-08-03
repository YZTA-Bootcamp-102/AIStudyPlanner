from sqlalchemy.orm import Session
from backend.models.ai_conversation import AIConversation
from backend.schemas.ai_conversation import AIConversationCreate

def create_conversation(db: Session, user_id: int, conv_in: AIConversationCreate, ai_resp: str):
    """
    Yeni bir AI konuşması kaydeder.
    """
    conv = AIConversation(user_id=user_id, ai_response=ai_resp, **conv_in.dict())
    db.add(conv); db.commit(); db.refresh(conv)
    return conv

def get_conversations(db: Session, user_id: int):
    """
    Kullanıcının geçmiş konuşmalarını döner.
    """
    return db.query(AIConversation).filter(AIConversation.user_id == user_id).all()
