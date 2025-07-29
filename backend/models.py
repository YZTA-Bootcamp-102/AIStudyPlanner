from database import Base
from sqlalchemy import Column, Boolean, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class User(Base):
    """
    Sistemdeki kullanıcıları temsil eder.
    Her kullanıcıya ait kimlik bilgileri, iletişim bilgileri ve sistemdeki rolü bu modelde saklanır.
    Diğer tüm öğrenme süreçleri bu kullanıcıya bağlanır.
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)  # Benzersiz kullanıcı kimliği
    email = Column(String, unique=True)  # E-posta adresi (benzersiz)
    username = Column(String, unique=True)  # Kullanıcı adı (benzersiz)
    first_name = Column(String)  # Kullanıcının adı
    last_name = Column(String)  # Kullanıcının soyadı
    hashed_password = Column(String)  # Şifrelenmiş parola
    is_active = Column(Boolean, default=True)  # Hesap aktif mi?
    role = Column(String)  # Kullanıcının rolü (örneğin 'öğrenci', 'eğitmen')
    phone_number = Column(String)  # İsteğe bağlı telefon numarası

    # İlişkiler
    learning_modules = relationship("LearningModule", back_populates="user")  # Kullanıcının eğitim modülleri
    daily_tasks = relationship("DailyTask", back_populates="user")  # Kullanıcının görevleri
    progress = relationship("Progress", back_populates="user")  # İlerlemesi
    ai_hints = relationship("AIHint", back_populates="user")  # AI ipuçları
    sprint_plans = relationship("SprintPlan", back_populates="user")  # Sprint planları
    calendar_integration = relationship("CalendarIntegration", back_populates="user")  # Takvim bağlantısı
    weekly_reviews = relationship("WeeklyReview", back_populates="user")  # Haftalık değerlendirmeler
    learning_goals = relationship("LearningGoal", back_populates="user")  # Öğrenme hedefleri

class LearningModule(Base):
    """
    Kullanıcının takip ettiği öğrenme modüllerini temsil eder.
    Modüller kullanıcı hedeflerine göre kategorilendirilir ve sıralanır.
    """
    __tablename__ = 'learning_modules'

    id = Column(Integer, primary_key=True)
    title = Column(String)  # Modül başlığı
    description = Column(Text)  # Modül içeriği açıklaması
    category = Column(String)  # Kategori (örneğin 'Python', 'Zaman Yönetimi')
    order = Column(Integer)  # Modül sıralaması
    learning_outcome = Column(Text)  # Modül sonunda kazanılacak bilgi/çıktı

    user_id = Column(Integer, ForeignKey('users.id'))  # Modülün sahibi
    user = relationship("User", back_populates="learning_modules")

class DailyTask(Base):
    """
    Günlük bazda oluşturulan öğrenme görevlerini tutar.
    Her görev, tarih ve saat bilgileriyle planlanır ve tamamlanma durumu izlenir.
    """
    __tablename__ = 'daily_tasks'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)  # Görev başlığı
    description = Column(Text)  # Görev açıklaması
    date = Column(DateTime)  # Görev günü
    start_time = Column(DateTime)  # Başlangıç zamanı
    duration_minutes = Column(Integer)  # Tahmini süre (dakika)
    is_completed = Column(Boolean, default=False)  # Tamamlandı mı?

    user_id = Column(Integer, ForeignKey('users.id'))  # Görev sahibi kullanıcı
    user = relationship("User", back_populates="daily_tasks")

    reminders = relationship("Reminder", back_populates="task")  # Göreve ait hatırlatmalar

class Reminder(Base):
    """
    Görevler için zamanında bildirim göndermeyi sağlayan hatırlatma servisidir.
    """
    __tablename__ = 'reminders'

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('daily_tasks.id'))  # Bağlı olduğu görev
    notify_time = Column(DateTime)  # Bildirim zamanı
    method = Column(String)  # Bildirim türü ('email', 'push')
    message = Column(Text)  # Bildirim mesaj içeriği

    task = relationship("DailyTask", back_populates="reminders")

class Progress(Base):
    """
    Kullanıcının öğrenme sürecindeki genel ilerlemesini ve başarı durumunu takip eder.
    """
    __tablename__ = 'progress'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # İlgili kullanıcı
    completed_tasks = Column(Integer)  # Tamamlanan görev sayısı
    total_tasks = Column(Integer)  # Toplam görev sayısı
    cumulative_score = Column(Integer)  # Genel puan
    badges = Column(String)  # Rozet bilgileri (JSON formatı önerilir)
    week = Column(Integer)  # Haftalık gösterim için
    month = Column(Integer)  # Aylık gösterim için
    year = Column(Integer)  # Yıllık gösterim için

    user = relationship("User", back_populates="progress")

class AIHint(Base):
    """
    Kullanıcılara AI destekli çalışma önerileri sunar.
    Günlük veriler üzerinden oluşturulan odaklanma ve verimlilik tavsiyelerini içerir.
    """
    __tablename__ = 'ai_hints'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Kullanıcıya ait
    date = Column(DateTime)  # Önerinin verildiği tarih
    hint_text = Column(Text)  # Öneri içeriği
    user_feedback = Column(String)  # Kullanıcı geri bildirimi ('applied', 'not_interesting')

    user = relationship("User", back_populates="ai_hints")

class SprintPlan(Base):
    """
    Haftalık sprint bazlı öğrenme planlarını içerir.
    Her sprint başlangıç ve bitiş tarihleriyle birlikte hedefleri ve özetleri barındırır.
    """
    __tablename__ = 'sprint_plans'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Plan sahibi
    start_date = Column(DateTime)  # Sprint başlangıç tarihi
    end_date = Column(DateTime)  # Sprint bitiş tarihi
    objectives = Column(Text)  # Sprint hedefleri
    summary = Column(Text)  # Sprint özeti

    user = relationship("User", back_populates="sprint_plans")

class CalendarIntegration(Base):
    """
    Google Calendar veya benzeri takvim hizmetleriyle entegrasyonu temsil eder.
    Görevlerin takvime eklenmesini ve eş zamanlı güncellenmesini sağlar.
    """
    __tablename__ = 'calendar_integrations'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Entegrasyonu kullanan kullanıcı
    provider = Column(String)  # Sağlayıcı adı ('google')
    calendar_id = Column(String)  # Takvim kimliği
    sync_token = Column(String)  # Senkronizasyon için token

    user = relationship("User", back_populates="calendar_integration")

class WeeklyReview(Base):
    """
    Kullanıcının haftalık öğrenme performansını ve AI analizini içerir.
    Güçlü yönler, gelişim alanları ve geçmiş karşılaştırmaları yer alır.
    """
    __tablename__ = 'weekly_reviews'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Değerlendirme yapılan kullanıcı
    week_number = Column(Integer)  # Yılın kaçıncı haftası
    year = Column(Integer)  # Yıl bilgisi
    strengths = Column(Text)  # Bu haftaki güçlü yönler
    improvement_areas = Column(Text)  # Gelişim alanları
    comparison_with_previous = Column(Text)  # Geçmiş haftalarla karşılaştırma

    user = relationship("User", back_populates="weekly_reviews")

class LearningGoal(Base):
    """
    Kullanıcının belirlediği öğrenme hedeflerini saklar.
    AI tarafından rota önerisi oluşturmak için temel veri sağlar.
    """
    __tablename__ = 'learning_goals'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))  # Hedef sahibi
    goal_text = Column(Text)  # Hedefin açıklaması
    interest_areas = Column(String)  # İlgi alanları
    current_knowledge_level = Column(String)  # Mevcut bilgi seviyesi
    start_date = Column(DateTime)  # Hedef başlangıcı
    target_end_date = Column(DateTime)  # Hedefin bitiş tarihi

    user = relationship("User", back_populates="learning_goals")
