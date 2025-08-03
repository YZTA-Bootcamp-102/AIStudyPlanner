from google_auth_oauthlib.flow import InstalledAppFlow
import os
import json

SCOPES = ['https://www.googleapis.com/auth/calendar']
CLIENT_SECRET_FILE = r'C:\Users\tepe1\OneDrive\PythonProject\AIStudyPlanner\backend\google_calendar_integration\client_secret_30037224350-2g8umrjpik2q2o50trr036ac01b88v7e.apps.googleusercontent.com.json'

TOKEN_FILE = 'token.json'

def create_token():
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
    creds = flow.run_local_server(port=8080)

    with open(TOKEN_FILE, 'w') as token:
        token.write(creds.to_json())
    print("Token dosyası oluşturuldu:", TOKEN_FILE)

if __name__ == '__main__':
    create_token()
