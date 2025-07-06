from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base

class WeeklyReview(Base):
    """
    Kullanıcının haftalık ilerleme değerlendirmelerini temsil eder.

    Alanlar:
        id: Değerlendirme ID'si.
        user_id: Değerlendirmeyi yapan kullanıcı.
        week_number: Yıl içindeki hafta numarası.
        year: Yıl bilgisi.
        strengths: Kullanıcının güçlü yönleri.
        improvement_areas: Gelişime açık alanlar.
        comparison_with_previous: Önceki haftalarla karşılaştırma.
        created_at: Oluşturulma zamanı.

    İlişkiler:
        user: Bu değerlendirmeyi yapan kullanıcı.
    """

    __tablename__ = 'weekly_reviews'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    week_number = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    strengths = Column(Text)
    improvement_areas = Column(Text)
    comparison_with_previous = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="weekly_reviews")