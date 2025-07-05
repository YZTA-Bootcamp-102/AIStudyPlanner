from backend.database import Base
from sqlalchemy import Column, Boolean, Integer, String, Text, ForeignKey, DateTime, Date, Time, Enum, CheckConstraint
from sqlalchemy.orm import relationship, backref
from datetime import datetime
from enum import Enum as PyEnum

# Enum tanımları
class TreeStage(PyEnum):
    SEED = "tohum"          # Ağacın tohum aşaması
    SPROUT = "filiz"        # Filizlenme aşaması
    SAPLING = "fidan"       # Fidan aşaması
    TREE = "ağaç"           # Oluşmuş ağaç
    MATURE_TREE = "olgun_ağaç"  # Olgun ağaç

class NotificationMethod(PyEnum):
    EMAIL = "email"         # E-posta bildirimi
    PUSH = "push"           # Mobil bildirim
    BOTH = "both"           # Her ikisi birden

class UserRole(PyEnum):
    USER = "kullanıcı"      # Normal kullanıcı
    ADMIN = "yönetici"      # Yönetici yetkileri

class User(Base):
    """
    Kullanıcı bilgilerini saklayan ana tablo
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)  # Benzersiz kullanıcı ID'si
    email = Column(String(120), unique=True, index=True, nullable=False)  # E-posta adresi
    username = Column(String(50), unique=True, index=True, nullable=False)  # Kullanıcı adı
    first_name = Column(String(50), nullable=False)  # Kullanıcının adı
    last_name = Column(String(50), nullable=False)  # Kullanıcının soyadı
    hashed_password = Column(String(100), nullable=False)  # Şifrelenmiş parola
    is_active = Column(Boolean, default=True)  # Hesap aktif mi?
    role = Column(Enum(UserRole), default=UserRole.USER.value)  # Kullanıcı rolü (USER/ADMIN)
    phone_number = Column(String(20))  # Telefon numarası
    total_study_minutes = Column(Integer, default=0)  # Toplam çalışma süresi (dakika)
    current_tree_stage = Column(Enum(TreeStage), default=TreeStage.SEED.value)  # Mevcut ağaç büyüme seviyesi
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    # İlişkiler
    learning_modules = relationship("LearningModule", back_populates="user")  # Kullanıcının öğrenme modülleri
    daily_tasks = relationship("DailyTask", back_populates="user")  # Günlük görevler
    progress = relationship("Progress", back_populates="user")  # İlerleme durumu
    ai_hints = relationship("AIHint", back_populates="user")  # AI önerileri
    sprint_plans = relationship("SprintPlan", back_populates="user")  # Haftalık planlar
    calendar_integration = relationship("CalendarIntegration", back_populates="user")  # Takvim entegrasyonu
    weekly_reviews = relationship("WeeklyReview", back_populates="user")  # Haftalık değerlendirmeler
    learning_goals = relationship("LearningGoal", back_populates="user")  # Öğrenme hedefleri
    study_sessions = relationship("StudySession", back_populates="user")  # Çalışma oturumları
    mindmap_nodes = relationship("MindmapNode", back_populates="user")  # Zihin haritası düğümleri
    ai_conversations = relationship("AIConversation", back_populates="user")  # AI konuşmaları
    level_answers = relationship("LevelAnswer", back_populates="user")  # Seviye testi cevapları

class LearningGoal(Base):
    """
    Kullanıcıların öğrenme hedeflerini saklar
    """
    __tablename__ = 'learning_goals'

    id = Column(Integer, primary_key=True)  # Benzersiz hedef ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    goal_text = Column(Text, nullable=False)  # Hedef açıklaması
    interest_areas = Column(String(200))  # İlgili alanlar (virgülle ayrılmış)
    current_knowledge_level = Column(String(50))  # Başlangıç bilgi seviyesi
    start_date = Column(Date, default=datetime.utcnow)  # Başlangıç tarihi
    target_end_date = Column(Date)  # Hedef bitiş tarihi
    is_active = Column(Boolean, default=True)  # Aktif hedef mi?
    is_achieved = Column(Boolean, default=False)  # Tamamlandı mı?
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    user = relationship("User", back_populates="learning_goals")  # Kullanıcı ilişkisi
    learning_modules = relationship("LearningModule", back_populates="learning_goal")  # İlişkili modüller
    study_sessions = relationship("StudySession", back_populates="learning_goal")  # Çalışma oturumları
    ai_conversations = relationship("AIConversation", back_populates="learning_goal")  # AI konuşmaları

class LearningModule(Base):
    """
    AI tarafından oluşturulan öğrenme modülleri
    """
    __tablename__ = 'learning_modules'

    id = Column(Integer, primary_key=True)  # Benzersiz modül ID'si
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'))  # Hedef ilişkisi
    title = Column(String(100), nullable=False)  # Modül başlığı
    description = Column(Text)  # Modül açıklaması
    category = Column(String(50))  # Kategori (örn: "Programlama")
    order = Column(Integer, default=0)  # Sıralama (küçük sayı önce)
    learning_outcome = Column(Text)  # Kazanılacak beceriler
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    user = relationship("User", back_populates="learning_modules")  # Kullanıcı ilişkisi
    learning_goal = relationship("LearningGoal", back_populates="learning_modules")  # Hedef ilişkisi

class DailyTask(Base):
    """
    Kullanıcıya atanan günlük öğrenme görevleri
    """
    __tablename__ = 'daily_tasks'

    id = Column(Integer, primary_key=True)  # Benzersiz görev ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'))  # Hedef ilişkisi
    title = Column(String(100), nullable=False)  # Görev başlığı
    description = Column(Text)  # Detaylı açıklama
    date = Column(Date, index=True)  # Görev tarihi
    start_time = Column(Time)  # Başlangıç saati
    duration_minutes = Column(Integer)  # Tahmini süre (dakika)
    is_completed = Column(Boolean, default=False)  # Tamamlandı mı?
    calendar_event_id = Column(String(100))  # Takvim etkinlik ID'si (Google Calendar)
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    user = relationship("User", back_populates="daily_tasks")  # Kullanıcı ilişkisi
    learning_goal = relationship("LearningGoal")  # Hedef ilişkisi
    reminders = relationship("Reminder", back_populates="task")  # Hatırlatıcılar

class Reminder(Base):
    """
    Görevler için hatırlatıcı sistem
    """
    __tablename__ = 'reminders'

    id = Column(Integer, primary_key=True)  # Benzersiz hatırlatıcı ID'si
    task_id = Column(Integer, ForeignKey('daily_tasks.id'))  # Görev ilişkisi
    notify_time = Column(DateTime, nullable=False)  # Bildirim zamanı
    method = Column(Enum(NotificationMethod), default=NotificationMethod.PUSH.value)  # Bildirim yöntemi
    message = Column(Text)  # Bildirim mesajı
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi

    task = relationship("DailyTask", back_populates="reminders")  # Görev ilişkisi

class Progress(Base):
    """
    Kullanıcının genel öğrenme ilerlemesi
    """
    __tablename__ = 'progress'

    id = Column(Integer, primary_key=True)  # Benzersiz ilerleme ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    cumulative_score = Column(Integer, default=0)  # Toplam puan
    badges = Column(String(200))  # Kazanılan rozetler (JSON)
    week = Column(Integer)  # Hafta numarası
    month = Column(Integer)  # Ay numarası
    year = Column(Integer)  # Yıl bilgisi
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    user = relationship("User", back_populates="progress")  # Kullanıcı ilişkisi

class AIHint(Base):
    """
    AI tarafından üretilen kişiselleştirilmiş ipuçları
    """
    __tablename__ = 'ai_hints'

    id = Column(Integer, primary_key=True)  # Benzersiz ipucu ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    date = Column(Date, default=datetime.utcnow().date)  # Tarih bilgisi
    hint_text = Column(Text, nullable=False)  # İpucu içeriği
    user_feedback = Column(String(50))  # Kullanıcı geri bildirimi
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi

    user = relationship("User", back_populates="ai_hints")  # Kullanıcı ilişkisi

class SprintPlan(Base):
    """
    Haftalık öğrenme planları (sprint'ler)
    """
    __tablename__ = 'sprint_plans'

    id = Column(Integer, primary_key=True)  # Benzersiz plan ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'))  # Hedef ilişkisi
    start_date = Column(Date, nullable=False)  # Başlangıç tarihi
    end_date = Column(Date, nullable=False)  # Bitiş tarihi
    objectives = Column(Text, nullable=False)  # Haftalık hedefler
    summary = Column(Text)  # Değerlendirme özeti
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    user = relationship("User", back_populates="sprint_plans")  # Kullanıcı ilişkisi

class CalendarIntegration(Base):
    """
    Harici takvim servisleri entegrasyonu
    """
    __tablename__ = 'calendar_integrations'

    id = Column(Integer, primary_key=True)  # Benzersiz entegrasyon ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    provider = Column(String(50), nullable=False)  # Sağlayıcı (Google, Outlook vb.)
    calendar_id = Column(String(100), nullable=False)  # Takvim ID'si
    sync_token = Column(String(200))  # Senkronizasyon token'ı
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    user = relationship("User", back_populates="calendar_integration")  # Kullanıcı ilişkisi

class WeeklyReview(Base):
    """
    Haftalık performans değerlendirme raporları
    """
    __tablename__ = 'weekly_reviews'

    id = Column(Integer, primary_key=True)  # Benzersiz değerlendirme ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    week_number = Column(Integer, nullable=False)  # Yılın kaçıncı haftası
    year = Column(Integer, nullable=False)  # Yıl bilgisi
    strengths = Column(Text)  # Güçlü yönler
    improvement_areas = Column(Text)  # Geliştirilecek alanlar
    comparison_with_previous = Column(Text)  # Önceki haftalarla karşılaştırma
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi

    user = relationship("User", back_populates="weekly_reviews")  # Kullanıcı ilişkisi

class LevelQuestion(Base):
    """
    Kullanıcı seviye testi soruları
    """
    __tablename__ = 'level_questions'

    id = Column(Integer, primary_key=True)  # Benzersiz soru ID'si
    topic = Column(String(100), nullable=False)  # Konu başlığı
    question_text = Column(Text, nullable=False)  # Soru metni
    correct_option = Column(String(1),  # Doğru şık (A/B/C/D)
                          CheckConstraint("correct_option IN ('A','B','C','D')"),
                          nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi

    options = relationship("LevelQuestionOption", back_populates="question")  # Seçenekler
    answers = relationship("LevelAnswer", back_populates="question")  # Cevaplar

class LevelQuestionOption(Base):
    """
    Seviye testi sorularının şıkları
    """
    __tablename__ = 'level_question_options'

    id = Column(Integer, primary_key=True)  # Benzersiz seçenek ID'si
    question_id = Column(Integer, ForeignKey('level_questions.id'))  # Soru ilişkisi
    option_key = Column(String(1),  # Şık harfi (A/B/C/D)
                      CheckConstraint("option_key IN ('A','B','C','D')"),
                      nullable=False)
    option_text = Column(Text, nullable=False)  # Şık metni
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi

    question = relationship("LevelQuestion", back_populates="options")  # Soru ilişkisi

class LevelAnswer(Base):
    """
    Kullanıcıların seviye testi cevapları
    """
    __tablename__ = 'level_answers'

    id = Column(Integer, primary_key=True)  # Benzersiz cevap ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    question_id = Column(Integer, ForeignKey('level_questions.id'))  # Soru ilişkisi
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'))  # Hedef ilişkisi
    selected_option = Column(String(1),  # Seçilen şık
                           CheckConstraint("selected_option IN ('A','B','C','D')"))
    timestamp = Column(DateTime, default=datetime.utcnow)  # Cevaplama zamanı

    user = relationship("User", back_populates="level_answers")  # Kullanıcı ilişkisi
    question = relationship("LevelQuestion", back_populates="answers")  # Soru ilişkisi
    learning_goal = relationship("LearningGoal")  # Hedef ilişkisi

class StudySession(Base):
    """
    Çalışma oturumlarını ve sayaç verilerini kaydeder
    """
    __tablename__ = 'study_sessions'

    id = Column(Integer, primary_key=True)  # Benzersiz oturum ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'))  # Hedef ilişkisi
    duration_minutes = Column(Integer, nullable=False)  # Oturum süresi (dakika)
    date = Column(Date, default=datetime.utcnow().date, index=True)  # Oturum tarihi
    growth_stage = Column(Enum(TreeStage), default=TreeStage.SEED.value)  # Büyüme seviyesi
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi

    user = relationship("User", back_populates="study_sessions")  # Kullanıcı ilişkisi
    learning_goal = relationship("LearningGoal", back_populates="study_sessions")  # Hedef ilişkisi

class MindmapNode(Base):
    """
    Zihin haritası düğümlerini saklar
    """
    __tablename__ = 'mindmap_nodes'

    id = Column(Integer, primary_key=True)  # Benzersiz düğüm ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'))  # Hedef ilişkisi
    text = Column(Text, nullable=False)  # Düğüm içeriği
    parent_id = Column(Integer, ForeignKey('mindmap_nodes.id'))  # Üst düğüm ID'si
    position_x = Column(Integer, default=0)  # X koordinatı (tahta üzerinde)
    position_y = Column(Integer, default=0)  # Y koordinatı (tahta üzerinde)
    is_ai_generated = Column(Boolean, default=False)  # AI ile oluşturuldu mu?
    created_at = Column(DateTime, default=datetime.utcnow)  # Oluşturulma tarihi
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Güncelleme tarihi

    user = relationship("User", back_populates="mindmap_nodes")  # Kullanıcı ilişkisi
    learning_goal = relationship("LearningGoal")  # Hedef ilişkisi
    children = relationship("MindmapNode", backref=backref('parent', remote_side=[id]))  # Alt düğümler

class AIConversation(Base):
    """
    Kullanıcı ile AI arasındaki konuşma geçmişi
    """
    __tablename__ = 'ai_conversations'

    id = Column(Integer, primary_key=True)  # Benzersiz konuşma ID'si
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcı ilişkisi
    learning_goal_id = Column(Integer, ForeignKey('learning_goals.id'))  # Hedef ilişkisi
    user_input = Column(Text, nullable=False)  # Kullanıcı mesajı
    ai_response = Column(Text, nullable=False)  # AI yanıtı
    timestamp = Column(DateTime, default=datetime.utcnow)  # Konuşma zamanı

    user = relationship("User", back_populates="ai_conversations")  # Kullanıcı ilişkisi
    learning_goal = relationship("LearningGoal", back_populates="ai_conversations")  # Hedef ilişkisi