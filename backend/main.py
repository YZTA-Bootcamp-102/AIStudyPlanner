from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from backend.database import engine
from backend.database import Base  #

# Router'ları içeri aktar
from backend.routers.auth import router as auth_router
from backend.routers.reminder import router as reminder_router
from backend.routers.weekly_review import router as weekly_review_router
from backend.routers.level import router as level_router
from backend.routers.study_session import router as study_session_router
from backend.routers.sprint_plan import router as sprint_plan_router
from backend.routers.progress import router as progress_router
from backend.routers.daily_task import router as daily_task_router
from backend.routers.ai import router as ai_router
from backend.routers.calendar_integration import router as calendar_router
from backend.routers.ai_hint import router as ai_hint_router
from backend.routers.notification_settings import router as notification_settings_router
from backend.routers.ai_conversation import router as ai_conversation_router
from backend.routers.module_completion import router as module_completion_router




app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jinja2 templates klasörünü bağla (örneğin HTML email şablonları için)
templates = Jinja2Templates(directory="backend/utils/email/templates")

# Router'ları ekle
app.include_router(auth_router)
app.include_router(reminder_router)
app.include_router(weekly_review_router)
app.include_router(level_router)
app.include_router(study_session_router)
app.include_router(sprint_plan_router)
app.include_router(progress_router)
app.include_router(daily_task_router)
app.include_router(ai_router)
app.include_router(calendar_router)
app.include_router(ai_conversation_router)
app.include_router(ai_hint_router)
app.include_router(module_completion_router)
app.include_router(notification_settings_router)

