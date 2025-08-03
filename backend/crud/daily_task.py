from sqlalchemy.orm import Session
from datetime import date, datetime, time
from typing import Optional, List
from sqlalchemy import func

from backend.models.daily_task import DailyTask
from backend.models.daily_subtask import DailySubtask
from backend.models.daily_note import DailyNote
from backend.schemas.daily_task import (
    DailyTaskCreate, DailyTaskUpdate,
    DailySubtaskCreate, DailyNoteCreate
)

def create_daily_task(db: Session, task_in: DailyTaskCreate, user_id: int) -> DailyTask:
    """
    Yeni günlük görev oluşturur.
    """
    db_task = DailyTask(
        user_id=user_id,
        title=task_in.title,
        description=task_in.description,
        date=task_in.date,
        start_time=task_in.start_time,
        duration_minutes=task_in.duration_minutes,
        calendar_event_id=task_in.calendar_event_id,
        learning_goal_id=task_in.learning_goal_id,
        category=task_in.category,
        tags=task_in.tags,
        repeat=task_in.repeat,
        custom_repeat=task_in.custom_repeat,
        priority=task_in.priority,
    )

    for subtask_in in task_in.subtasks or []:
        db_subtask = DailySubtask(text=subtask_in.text, done=subtask_in.done)
        db_task.subtasks.append(db_subtask)

    for note_in in task_in.notes or []:
        db_note = DailyNote(text=note_in.text)
        db_task.notes.append(db_note)

    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_task_by_id(db: Session, task_id: int) -> Optional[DailyTask]:
    return db.query(DailyTask).filter(DailyTask.id == task_id).first()

def get_tasks_by_user_and_date(db: Session, user_id: int, task_date: date) -> List[DailyTask]:
    return db.query(DailyTask).filter(
        DailyTask.user_id == user_id,
        DailyTask.date == task_date
    ).order_by(DailyTask.start_time).all()

def get_all_tasks_by_user(db: Session, user_id: int) -> List[DailyTask]:
    return db.query(DailyTask).filter(DailyTask.user_id == user_id).order_by(DailyTask.date.desc()).all()

def update_daily_task(db: Session, task_id: int, update_data: DailyTaskUpdate) -> Optional[DailyTask]:
    task = get_task_by_id(db, task_id)
    if not task:
        return None

    update_dict = update_data.dict(exclude_unset=True)
    subtasks = update_dict.pop('subtasks', None)
    notes = update_dict.pop('notes', None)

    # start_time güvenli dönüşüm
    if 'start_time' in update_dict:
        time_val = update_dict['start_time']
        if isinstance(time_val, str):
            try:
                update_dict['start_time'] = datetime.strptime(time_val, '%H:%M:%S').time()
            except ValueError:
                try:
                    update_dict['start_time'] = datetime.strptime(time_val, '%H:%M').time()
                except ValueError:
                    update_dict.pop('start_time')

    for key, value in update_dict.items():
        setattr(task, key, value)

    if subtasks is not None:
        task.subtasks.clear()
        for subtask_in in subtasks:
            if isinstance(subtask_in, dict):
                subtask_in = DailySubtaskCreate(**subtask_in)
            db_subtask = DailySubtask(text=subtask_in.text, done=subtask_in.done or False)
            task.subtasks.append(db_subtask)

    if notes is not None:
        task.notes.clear()
        for note_in in notes:
            if isinstance(note_in, dict):
                note_in = DailyNoteCreate(**note_in)
            db_note = DailyNote(text=note_in.text)
            task.notes.append(db_note)

    db.commit()
    db.refresh(task)
    return task

def delete_daily_task(db: Session, task_id: int) -> bool:
    task = get_task_by_id(db, task_id)
    if not task:
        return False

    db.delete(task)
    db.commit()
    return True

def mark_task_as_completed(db: Session, task_id: int) -> Optional[DailyTask]:
    task = get_task_by_id(db, task_id)
    if not task:
        return None

    task.is_completed = True
    db.commit()
    db.refresh(task)
    return task

def get_task_counts_by_date(db: Session, user_id: int) -> dict:
    results = db.query(DailyTask.date, func.count(DailyTask.id))\
        .filter(DailyTask.user_id == user_id)\
        .group_by(DailyTask.date)\
        .all()

    return {day.isoformat(): count for day, count in results}