# calendar_integration.py
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/calendar']
CLIENT_SECRET_FILE = 'client_secret.json'
TOKEN_FILE = 'token.json'

def get_calendar_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        try:
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        except Exception as e:
            print(f"Token dosyasından kimlik bilgileri yüklenirken hata oluştu: {e}")
            creds = None
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Token yenilenirken hata oluştu: {e}")
                creds = None
        if not creds or not creds.valid:
            try:
                flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
                creds = flow.run_local_server(port=8000, open_browser=True)
                with open(TOKEN_FILE, 'w') as token:
                    token.write(creds.to_json())
            except Exception as e:
                print(f"Kimlik doğrulama akışı başlatılırken hata oluştu: {e}")
                raise

    return build('calendar', 'v3', credentials=creds)


def create_event(summary, description, start_time, end_time):
    service = get_calendar_service()
    event = {
        'summary': summary,
        'description': description,
        'start': {
            'dateTime': start_time,
            'timeZone': 'Europe/Istanbul',
        },
        'end': {
            'dateTime': end_time,
            'timeZone': 'Europe/Istanbul',
        },
    }
    try:
        created_event = service.events().insert(calendarId='primary', body=event).execute()
        print(f"Etkinlik başarıyla oluşturuldu. ID: {created_event.get('id')}")
        return created_event
    except HttpError as error:
        print(f"Etkinlik oluşturulurken Google API Hatası: {error}")
        print(f"Hata Detayı: {error.content.decode('utf-8')}")
        raise
    except Exception as e:
        print(f"Etkinlik oluşturulurken beklenmeyen bir hata oluştu: {e}")
        raise

def list_events(service, calendar_id='primary', max_results=10, time_min=None, time_max=None):
    try:
        params = {
            'calendarId': calendar_id,
            'maxResults': max_results,
            'singleEvents': True,
            'orderBy': 'startTime'
        }
        
        if time_min:
            params['timeMin'] = time_min
        if time_max:
            params['timeMax'] = time_max

        events_result = service.events().list(**params).execute()
        events = events_result.get('items', [])
        return events
    except HttpError as error:
        print(f"Etkinlikler listelenirken Google API Hatası: {error}")
        print(f"Hata Detayı: {error.content.decode('utf-8')}")
        raise
    except Exception as e:
        print(f"Etkinlikler listelenirken beklenmeyen bir hata oluştu: {e}")
        raise


def update_event(service, event_id, calendar_id='primary', updated_event=None):
    if not updated_event:
        raise ValueError("updated_event is required")

    if 'start' not in updated_event or 'end' not in updated_event:
        raise ValueError("start and end objects are required in updated_event payload.")

    try:
        event = service.events().get(calendarId=calendar_id, eventId=event_id).execute()

        if 'summary' in updated_event:
            event['summary'] = updated_event['summary']
        if 'description' in updated_event:
            event['description'] = updated_event['description']
        
        if 'start' in updated_event:
            event['start'] = updated_event['start']
        if 'end' in updated_event:
            event['end'] = updated_event['end']

        updated_event_response = service.events().update(
            calendarId=calendar_id,
            eventId=event_id,
            body=event
        ).execute()

        print(f"Etkinlik başarıyla güncellendi. ID: {updated_event_response.get('id')}")
        return updated_event_response

    except HttpError as error:
        print(f"Etkinlik güncellenirken Google API Hatası: {error}")
        print(f"Hata Detayı: {error.content.decode('utf-8')}")
        
        if error.resp.status == 404:
            print(f"Hata: {event_id} kimliğine sahip etkinlik bulunamadı.")
        elif error.resp.status == 403:
            print(f"Hata: {event_id} kimliğine sahip etkinliği güncelleme izniniz yok.")
        
        raise
    except ValueError as ve:
        print(f"Giriş verisi doğrulama hatası: {ve}")
        raise
    except Exception as e:
        print(f"Etkinlik güncellenirken beklenmeyen bir hata oluştu: {e}")
        raise


def delete_event(service, event_id, calendar_id='primary'):
    try:
        service.events().delete(calendarId=calendar_id, eventId=event_id).execute()
        print(f"Etkinlik başarıyla silindi. ID: {event_id}")
        return True
    except HttpError as error:
        print(f"Etkinlik silinirken Google API Hatası: {error}")
        print(f"Hata Detayı: {error.content.decode('utf-8')}")

        if error.resp.status == 404:
            print(f"Hata: {event_id} kimliğine sahip etkinlik bulunamadı.")
        elif error.resp.status == 403:
            print(f"Hata: {event_id} kimliğine sahip etkinliği silme izniniz yok.")
        
        raise
    except Exception as e:
        print(f"Etkinlik silinirken beklenmeyen bir hata oluştu: {e}")
        raise