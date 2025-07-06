import os
from datetime import datetime
from typing import Optional, Any

from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/calendar']
CLIENT_SECRET_FILE = os.getenv('GOOGLE_CLIENT_SECRET_PATH', 'client_secret.json')
TOKEN_FILE = os.getenv('GOOGLE_TOKEN_FILE', 'token.json')


def _load_credentials() -> Credentials:
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    return creds


def _save_credentials(creds: Credentials):
    with open(TOKEN_FILE, 'w') as token:
        token.write(creds.to_json())


def get_calendar_service():
    """
    Google Calendar API servisini döner. Gerekli kimlik doğrulama işlemleri yapılır.
    """
    creds = _load_credentials()

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        _save_credentials(creds)

    return build('calendar', 'v3', credentials=creds)


def create_event(summary: str, description: str, start_time: str, end_time: str) -> dict[str, Any]:
    """
    Google Calendar'da yeni bir etkinlik oluşturur.
    """
    service = get_calendar_service()
    event_payload = {
        'summary': summary,
        'description': description,
        'start': {'dateTime': start_time, 'timeZone': 'Europe/Istanbul'},
        'end': {'dateTime': end_time, 'timeZone': 'Europe/Istanbul'},
    }
    return service.events().insert(calendarId='primary', body=event_payload).execute()


def list_events(max_results: int = 10, time_min: Optional[str] = None, time_max: Optional[str] = None) -> list[dict]:
    """
    Google Calendar'dan etkinlik listesi çeker.
    """
    service = get_calendar_service()
    params = {
        'calendarId': 'primary',
        'maxResults': max_results,
        'singleEvents': True,
        'orderBy': 'startTime'
    }
    if time_min:
        params['timeMin'] = time_min
    if time_max:
        params['timeMax'] = time_max

    return service.events().list(**params).execute().get('items', [])


def update_event(event_id: str, updated_fields: dict[str, Any]) -> dict[str, Any]:
    """
    Var olan bir etkinliği günceller.
    """
    service = get_calendar_service()
    event = service.events().get(calendarId='primary', eventId=event_id).execute()

    event.update(updated_fields)
    return service.events().update(calendarId='primary', eventId=event_id, body=event).execute()


def delete_event(event_id: str) -> None:
    """
    Var olan bir etkinliği siler.
    """
    service = get_calendar_service()
    service.events().delete(calendarId='primary', eventId=event_id).execute()
