from sqlalchemy.orm import Session
from backend.models import LearningGoal, LearningModule
from backend.schemas.learning import LearningGoalCreate, LearningModuleCreate

def create_goal( db: Session, user_id: int, goal_data: LearningGoalCreate):
    """
    Veritabanına yeni bir öğrenme hedefi (LearningGoal) kaydeder.

    Args:
        db (Session): SQLAlchemy veritabanı oturumu.
        user_id (int): Hedefi oluşturan kullanıcının ID'si.
        goal_data (LearningGoalCreate): Kullanıcının hedef bilgileri (Pydantic şeması).

    Returns:
        LearningGoal: Oluşturulan hedef veritabanı nesnesi.
    """


    # Pydantic modelinden gelen veriyi SQLAlchemy modeline dönüştür
    goal = LearningGoal(**goal_data.dict(), user_id=user_id)

    db.add(goal)       # Veritabanına ekle
    db.commit()        # Değişiklikleri kaydet
    db.refresh(goal)   # Geri dönüşte güncel veriyi al (ID vb. dahil)

    return goal

def create_modules_for_user(db: Session, user_id: int, modules_data: list[LearningModuleCreate]):
    """
    Kullanıcının hedeflerine göre birden fazla öğrenme modülünü veritabanına kaydeder.

    Args:
        db (Session): SQLAlchemy veritabanı oturumu.
        user_id (int): Modülleri alacak kullanıcının ID'si.
        modules_data (list[LearningModuleCreate]): Modül bilgileri (AI veya manuel olarak oluşturulmuş).

    Returns:
        List[LearningModule]: Veritabanına eklenen modül nesneleri listesi.
    """

    created = []

    for data in modules_data:
        # Her modülü LearningModule modeline dönüştür ve kullanıcıya ata
        module = LearningModule(**data.dict(), user_id=user_id)
        db.add(module)
        created.append(module)  # Listeye ekle (return için)

    db.commit()  # Tüm modülleri tek seferde kaydet
    return created
