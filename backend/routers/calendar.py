from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from datetime import datetime
from googleapiclient.errors import HttpError
from calendar_integration import create_event, get_calendar_service, list_events, update_event, delete_event
from routers.auth import get_current_user
from typing import Optional

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


@router.post("/create-event")
async def create_calendar_event(
    event: EventRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = create_event(
            summary=event.summary,
            description=event.description,
            start_time=event.start_time.isoformat(),
            end_time=event.end_time.isoformat()
        )
        return {
            "message": "Etkinlik başarıyla oluşturuldu.",
            "event_details": {
                "id": result.get('id'),
                "summary": result.get('summary'),
                "start_time": result.get('start', {}).get('dateTime'),
                "end_time": result.get('end', {}).get('dateTime'),
                "html_link": result.get('htmlLink')
            }
        }
    except HttpError as http_err:
        print(f"API katmanında Google API Hatası (create): {http_err}")
        print(f"Hata Detayı (create): {http_err.content.decode('utf-8')}")
        raise HTTPException(status_code=http_err.resp.status, detail=http_err.content.decode('utf-8'))
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"API katmanında beklenmeyen bir hata oluştu (create): {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.get("/list-events")
async def list_calendar_events(
    max_results: int = Query(10, gt=0, le=50),
    start_date: Optional[datetime] = Query(None, description="Etkinliklerin başlangıç tarihi (örn: 2025-07-18T00:00:00Z)"),
    end_date: Optional[datetime] = Query(None, description="Etkinliklerin bitiş tarihi (örn: 2025-07-19T00:00:00Z)"),
    current_user: dict = Depends(get_current_user)
):
    try:
        service = get_calendar_service()
        
        time_min_str = start_date.isoformat() if start_date else None
        time_max_str = end_date.isoformat() if end_date else None

        events = list_events(service, max_results=max_results, time_min=time_min_str, time_max=time_max_str)

        return {"events": events}
    except HttpError as http_err:
        print(f"API katmanında Google API Hatası (list): {http_err}")
        print(f"Hata Detayı (list): {http_err.content.decode('utf-8')}")
        raise HTTPException(status_code=http_err.resp.status, detail=http_err.content.decode('utf-8'))
    except Exception as e:
        print(f"API katmanında beklenmeyen bir hata oluştu (list): {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.put("/update-event/{event_id}")
async def update_calendar_event(
    event_id: str,
    event_update: EventUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        service = get_calendar_service()

        updated_fields = {
            k: v.isoformat() if isinstance(v, datetime) else v
            for k, v in event_update.dict(exclude_unset=True).items() if v is not None
        }

        event_body = {}
        if 'summary' in updated_fields:
            event_body['summary'] = updated_fields['summary']
        if 'description' in updated_fields:
            event_body['description'] = updated_fields['description']

        if 'start_time' in updated_fields:
            event_body['start'] = {
                'dateTime': updated_fields['start_time'],
                'timeZone': 'Europe/Istanbul'
            }
        if 'end_time' in updated_fields:
            event_body['end'] = {
                'dateTime': updated_fields['end_time'],
                'timeZone': 'Europe/Istanbul'
            }

        updated_event_response = update_event(service, event_id, updated_event=event_body)

        return {"message": "Etkinlik başarıyla güncellendi.", "updated_event": updated_event_response}
    
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except HttpError as http_err:
        print(f"API katmanında Google API Hatası (update): {http_err}")
        print(f"Hata Detayı (update): {http_err.content.decode('utf-8')}")
        raise HTTPException(status_code=http_err.resp.status, detail=http_err.content.decode('utf-8'))
    except Exception as e:
        print(f"API katmanında beklenmeyen bir hata oluştu (update): {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@router.delete("/delete-event/{event_id}")
async def delete_calendar_event(
    event_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        service = get_calendar_service()
        delete_event(service, event_id)
        return {"message": "Etkinlik silindi"}
    except HttpError as http_err:
        print(f"API katmanında Google API Hatası (delete): {http_err}")
        print(f"Hata Detayı (delete): {http_err.content.decode('utf-8')}")
        raise HTTPException(status_code=http_err.resp.status, detail=http_err.content.decode('utf-8'))
    except Exception as e:
        print(f"API katmanında beklenmeyen bir hata oluştu (delete): {e}")
        raise