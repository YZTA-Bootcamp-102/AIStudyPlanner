from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

from googleapiclient.errors import HttpError
from backend.crud.calendar_integration import (
    create_event, list_events,
    update_event, delete_event
)
from backend.routers.auth import get_me as get_current_user

router = APIRouter(prefix="/calendar", tags=["Google Calendar"])


class EventRequest(BaseModel):
    summary: str
    description: str
    start_time: datetime
    end_time: datetime


class EventUpdateRequest(BaseModel):
    summary: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


def _handle_http_error(err: HttpError):
    content = err.content.decode('utf-8')
    raise HTTPException(status_code=err.resp.status, detail=content)


@router.post("/create-event")
def create_calendar_event(
    event: EventRequest,
    current_user: Any = Depends(get_current_user)
):
    try:
        return create_event(
            summary=event.summary,
            description=event.description,
            start_time=event.start_time.isoformat(),
            end_time=event.end_time.isoformat()
        )
    except HttpError as err:
        _handle_http_error(err)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.get("/list-events")
def get_calendar_events(
    max_results: int = Query(10, gt=0, le=50),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: Any = Depends(get_current_user)
):
    try:
        time_min = start_date.isoformat() if start_date else None
        time_max = end_date.isoformat() if end_date else None
        return list_events(max_results=max_results, time_min=time_min, time_max=time_max)
    except HttpError as err:
        _handle_http_error(err)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.put("/update-event/{event_id}")
def update_calendar_event(
    event_id: str,
    update_req: EventUpdateRequest,
    current_user: Any = Depends(get_current_user)
):
    data: dict[str, Any] = {}
    if update_req.summary is not None:
        data['summary'] = update_req.summary
    if update_req.description is not None:
        data['description'] = update_req.description
    if update_req.start_time is not None:
        data['start'] = {'dateTime': update_req.start_time.isoformat(), 'timeZone': 'Europe/Istanbul'}
    if update_req.end_time is not None:
        data['end'] = {'dateTime': update_req.end_time.isoformat(), 'timeZone': 'Europe/Istanbul'}

    if not data:
        raise HTTPException(status_code=400, detail="Hiçbir alan güncellenmedi.")

    try:
        return update_event(event_id, updated_fields=data)
    except HttpError as err:
        _handle_http_error(err)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))


@router.delete("/delete-event/{event_id}")
def delete_calendar_event(
    event_id: str,
    current_user: Any = Depends(get_current_user)
):
    try:
        delete_event(event_id)
        return {"message": "Etkinlik başarıyla silindi."}
    except HttpError as err:
        _handle_http_error(err)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))
