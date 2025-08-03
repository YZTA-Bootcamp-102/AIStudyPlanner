from sqlalchemy.orm import Session

from backend.models import SprintWeek
from backend.models.sprint_plan import SprintPlan
from backend.schemas.sprint_plan import SprintPlanCreate, SprintResponse


def create_plan(db: Session, user_id: int, sp_in: SprintPlanCreate) -> SprintPlan:
    sp = SprintPlan(user_id=user_id, **sp_in.dict())
    db.add(sp)
    db.commit()
    db.refresh(sp)
    return sp

def list_plans(db: Session, user_id: int) -> list[SprintPlan]:
    return db.query(SprintPlan).filter(SprintPlan.user_id == user_id).all()

def get_sprint_plan_by_goal(db: Session, user_id: int, goal_id: int):
    return db.query(SprintPlan).filter(
        SprintPlan.user_id == user_id,
        SprintPlan.learning_goal_id == goal_id
    ).first()

def save_sprint_weeks(db: Session, plan_id: int, sprint_response: SprintResponse):
    for week in sprint_response.weeks:
        topics_str = "\n".join(week.topics)
        week_model = SprintWeek(
            sprint_plan_id=plan_id,
            week_number=week.week_number,
            daily_minutes=week.daily_minutes,
            topics=topics_str
        )
        db.add(week_model)
    db.commit()
