from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta

from backend.database import get_db
from backend.models import SprintPlan, SprintWeek
from backend.schemas.sprint_plan import SprintPlanCreate, SprintPlanOut, SprintRequest, SprintPlanFullOut, WeeklySprint
from backend.crud import sprint_plan as crud_sprint
from backend.services.auth_service import get_current_user
from backend.models.user import User
from backend.services.gemini_sprint_planner import plan_sprint

router = APIRouter(prefix="/sprint-plans", tags=["Sprint Plans"])

@router.post("/", response_model=SprintPlanOut)
def create_sprint_plan(plan: SprintPlanCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Yeni sprint planı oluştur
    db_plan = SprintPlan(
        user_id=user.id,
        learning_goal_id=plan.learning_goal_id,
        duration_weeks=plan.duration_weeks,
        daily_minutes=plan.daily_minutes,
        start_date=plan.start_date,
        end_date=plan.end_date,
        objectives=plan.objectives
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    # Haftaları kaydet
    for w in plan.weeks:
        db_week = SprintWeek(
            sprint_plan_id=db_plan.id,
            week_number=w.week_number,
            topics="\n".join(w.topics),  # Metin olarak kaydediyoruz
            daily_minutes=w.daily_minutes
        )
        db.add(db_week)
    db.commit()

    return db_plan


@router.post("/gemini-sprint-plan", response_model=SprintPlanOut)
def gemini_sprint_plan(
        data: SprintRequest,
        goal_id: int = Query(..., description="Learning goal ID"),
        db: Session = Depends(get_db),
        user: User = Depends(get_current_user),
):
    sprint_response = plan_sprint(
        topic=data.topic,
        level=data.level,
        daily_minutes=data.daily_minutes,
        duration_weeks=data.duration_weeks
    )

    sp_create = SprintPlanCreate(
        learning_goal_id=goal_id,
        duration_weeks=data.duration_weeks,
        daily_minutes=data.daily_minutes,
        start_date=date.today(),
        end_date=date.today() + timedelta(weeks=data.duration_weeks),
        objectives=f"{data.topic} öğrenme hedefi için {data.duration_weeks} haftalık plan",
        weeks=[
            WeeklySprint(
                week_number=w.week_number,
                topics=w.topics,
                daily_minutes=w.daily_minutes
            ) for w in sprint_response.weeks
        ],
    )

    sprint_plan = crud_sprint.create_plan(db, user.id, sp_create)
    crud_sprint.save_sprint_weeks(db, sprint_plan.id, sprint_response)

    return sprint_plan

@router.get("/goal/{goal_id}", response_model=SprintPlanFullOut)
def get_sprint_plan_by_goal(
    goal_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sprint_plan = crud_sprint.get_sprint_plan_by_goal(db, user.id, goal_id)
    if not sprint_plan:
        raise HTTPException(status_code=404, detail="Sprint planı bulunamadı")

    weeks = db.query(SprintWeek).filter_by(sprint_plan_id=sprint_plan.id).all()
    weekly_data = [
        WeeklySprint(
            week_number=w.week_number,
            topics=w.topics.split("\n") if w.topics else [],
            daily_minutes=w.daily_minutes
        ) for w in weeks
    ]

    sprint_plan_out = SprintPlanOut.model_validate(sprint_plan)
    return SprintPlanFullOut(
        **sprint_plan_out.model_dump(),
        weeks=weekly_data
    )
