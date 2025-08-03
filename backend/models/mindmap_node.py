from sqlalchemy import Column, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref
from datetime import datetime

from backend.database import Base

class MindmapNode(Base):
    """
    Kullanıcının oluşturduğu veya AI tarafından oluşturulan zihin haritası düğümlerini temsil eder.

    Alanlar:
        id: Düğüm ID'si.
        user_id: Düğümün ait olduğu kullanıcı.
        learning_goal_id: İlgili öğrenme hedefi.
        text: Düğüm metni.
        parent_id: Üst düğüm ID'si (varsa).
        position_x, position_y: Görsel konum bilgileri.
        is_ai_generated: AI tarafından oluşturulmuş mu?
        created_at, updated_at: Zaman bilgileri.

    İlişkiler:
        user, learning_goal, children (alt düğümler), parent (üst düğüm).
    """

    __tablename__ = 'mindmap_nodes'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'), index=True)
    text = Column(Text, nullable=False)
    parent_id = Column(Integer, ForeignKey('mindmap_nodes.id'), nullable=True)
    position_x = Column(Integer, default=0)
    position_y = Column(Integer, default=0)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="mindmap_nodes")
    learning_goal = relationship("LearningGoal")
    children = relationship("MindmapNode", backref=backref('parent', remote_side=[id]))