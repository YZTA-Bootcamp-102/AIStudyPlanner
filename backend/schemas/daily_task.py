from pydantic import BaseModel, Field
from datetime import date, time, datetime
from typing import Optional,List,Union
from backend.models.enums import CategoryType, RepeatType, PriorityType

class DailySubtaskCreate(BaseModel):
    text: str
    done: Optional[bool] = False

class DailyNoteCreate(BaseModel):
    text: str
class DailyTaskBase(BaseModel):
    """
    Günlük görev için temel alanları tanımlar.
    """
    title: str
    description: Optional[str] = None
    date: date
    start_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    calendar_event_id: Optional[str] = None
    learning_goal_id: Optional[int] = None
    category: Optional[CategoryType] = CategoryType.other
    tags: List[str] = []
    repeat: Optional[RepeatType] = RepeatType.none
    custom_repeat: Optional[str] = None
    priority: Optional[PriorityType] = PriorityType.medium


class DailyTaskCreate(DailyTaskBase):
    user_id: int
    subtasks: Optional[List[DailySubtaskCreate]] = []
    notes: Optional[List[DailyNoteCreate]] = []

class DailyTaskUpdate(BaseModel):
    """
    Günlük görevi güncellemek için şema.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[Union[date, str]] = None
    start_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    is_completed: Optional[bool] = None
    calendar_event_id: Optional[str] = None
    learning_goal_id: Optional[int] = None
    category: Optional[CategoryType] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    repeat: Optional[RepeatType] = None
    custom_repeat: Optional[str] = None
    priority: Optional[PriorityType] = None
    subtasks: Optional[List[DailySubtaskCreate]] = Field(default_factory=list)
    notes: Optional[List[DailyNoteCreate]] = Field(default_factory=list)

    model_config = {
        "from_attributes": True,
        "use_enum_values": True
    }
class DailyTaskOut(DailyTaskBase):
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    subtasks: List[DailySubtaskCreate] = []
    notes: List[DailyNoteCreate] = []

    model_config = {
        "from_attributes": True,
        "use_enum_values": True

    }