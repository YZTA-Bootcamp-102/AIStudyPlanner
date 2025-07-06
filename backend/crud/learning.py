from sqlalchemy.orm import Session
from backend.models import LearningGoal, LearningModule
from backend.schemas.learning import LearningGoalCreate, LearningModuleCreate

def create_goal(db: Session, user_id: int, goal_data: LearningGoalCreate):
    """
    Yeni bir öğrenme hedefini veritabanına kaydeder.
    """
    goal = LearningGoal(**goal_data.dict(), user_id=user_id)
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

def create_modules_for_user(db: Session, user_id: int, modules_data: list[LearningModuleCreate]):
    """
    Kullanıcının hedefine ait birden fazla modülü oluşturur ve kaydeder.
    """
    created = []
    for data in modules_data:
        module = LearningModule(**data.dict(), user_id=user_id)
        db.add(module)
        created.append(module)
    db.commit()
    return created

def get_latest_goal_by_user(db: Session, user_id: int):
    """
    En son oluşturulan öğrenme hedefini getirir.
    """
    return (
        db.query(LearningGoal)
        .filter(LearningGoal.user_id == user_id)
        .order_by(LearningGoal.created_at.desc())
        .first()
    )

def get_goal_by_id(db: Session, user_id: int, goal_id: int):
    """
    Belirtilen kullanıcıya ve hedef ID'sine ait hedefi döner veya None.
    """
    return db.query(LearningGoal).filter_by(id=goal_id, user_id=user_id).first()

def get_all_goals_by_user(db: Session, user_id: int):
    """
    Bir kullanıcının tüm öğrenme hedeflerini listeler.
    """
    return (
        db.query(LearningGoal)
        .filter_by(user_id=user_id)
        .order_by(LearningGoal.created_at.desc())
        .all()
    )

def update_goal(db: Session, user_id: int, goal_id: int, updated_data: LearningGoalCreate):
    """
    Belirli bir hedefi günceller. Kullanıcıya ait değilse None döner.
    """
    goal = get_goal_by_id(db, user_id, goal_id)
    if not goal:
        return None
    for key, value in updated_data.dict().items():
        setattr(goal, key, value)
    db.commit()
    db.refresh(goal)
    return goal

def delete_goal(db: Session, user_id: int, goal_id: int):
    """
    Belirtilen hedefi siler. Başarılıysa True döner.
    """
    goal = get_goal_by_id(db, user_id, goal_id)
    if not goal:
        return False
    db.delete(goal)
    db.commit()
    return True

def get_modules_by_goal_id(db: Session, user_id: int, goal_id: int):
    """
    Kullanıcının hedefine ait modülleri döner.
    """
    return (
        db.query(LearningModule)
        .filter_by(user_id=user_id, learning_goal_id=goal_id)
        .all()
    )

def delete_modules_by_goal_id(db: Session, user_id: int, goal_id: int):
    """
    Hedefe ait tüm modülleri siler ve silinen sayısını döner.
    """
    modules = get_modules_by_goal_id(db, user_id, goal_id)
    count = len(modules)
    for module in modules:
        db.delete(module)
    db.commit()
    return count
