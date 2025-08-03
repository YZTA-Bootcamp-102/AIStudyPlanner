from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.database import get_db
from backend.services.auth_service import get_current_user
from backend.services.ai_conversation_service import add_conv_and_store, list_user_convs
from backend.schemas.ai_conversation import AIConversationCreate, AIConversationOut

router = APIRouter(prefix="/ai/conversations", tags=["AI Conversations"])

@router.post("/", response_model=AIConversationOut, summary="Yeni bir AI konuşması başlat")
def post_conversation(
    conv_in: AIConversationCreate,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Yetkisiz erişim")
    # TODO: AI tarafından gerçek cevap üretme işlevi entegre edilmeli
    ai_resp = "AI yanıt içerik placeholder"
    conv = add_conv_and_store(db, user["user_id"], conv_in, ai_resp)
    return conv

@router.get("/", response_model=List[AIConversationOut], summary="Kullanıcının AI konuşmalarını getir")
def list_conversations(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not user:
        raise HTTPException(status_code=401, detail="Yetkisiz erişim")
    convs = list_user_convs(db, user["user_id"])
    return convs
