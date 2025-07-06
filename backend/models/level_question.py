from sqlalchemy import Column, Integer, Text, Enum, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime

from backend.database import Base
from backend.models.enums import OptionKey

class LevelQuestion(Base):
    """
    Seviye belirleme testi için soruları temsil eder.

    Alanlar:
        id: Soru ID'si.
        topic: Soru konusu.
        question_text: Soru içeriği.
        correct_option: Doğru seçenek.
        created_at: Oluşturulma zamanı.

    İlişkiler:
        options: Soruya ait şıklar.
        answers: Bu soruya verilen cevaplar.
    """

    __tablename__ = 'level_questions'

    id = Column(Integer, primary_key=True)
    topic = Column(String(100), nullable=False)
    question_text = Column(Text, nullable=False)
    correct_option = Column(Enum(OptionKey, native_enum=False), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    options = relationship("LevelQuestionOption", back_populates="question")
    answers = relationship("LevelAnswer", back_populates="question")


class LevelQuestionOption(Base):
    """
       Seviye sorularına ait seçenekleri temsil eder.

       Alanlar:
           id: Şık ID'si.
           question_id: Ait olduğu soru ID'si.
           option_key: A, B, C, D gibi anahtar.
           option_text: Seçenek metni.
           created_at: Oluşturulma tarihi.

       İlişkiler:
           question: Ait olduğu soru.
       """
    __tablename__ = 'level_question_options'

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey('level_questions.id'), index=True)
    option_key = Column(Enum(OptionKey, native_enum=False), nullable=False)
    option_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    question = relationship("LevelQuestion", back_populates="options")

