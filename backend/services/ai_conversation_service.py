from sqlalchemy.orm import Session
from typing import List

from backend.crud.ai_conversation import create_conversation, get_conversations
from backend.schemas.ai_conversation import AIConversationCreate, AIConversationOut

def add_conv_and_store(db: Session, user_id: int, conv_in: AIConversationCreate, ai_resp: str) -> AIConversationOut:
    """
    Yeni bir AI konuşmasını ekler ve kaydeder.
    """
    conv = create_conversation(db, user_id, conv_in, ai_resp)
    return conv

def list_user_convs(db: Session, user_id: int) -> List[AIConversationOut]:
    """
    Belirli bir kullanıcıya ait AI konuşmalarını döner.
    """
    return get_conversations(db, user_id)
