from pydantic import BaseModel
from datetime import datetime

# Kullanıcıdan alınacak öğrenme hedefi oluşturma isteği için model
class LearningGoalCreate(BaseModel):
    goal_text: str                      # Öğrenme hedefi metni (örnek: "Python öğrenmek istiyorum")
    interest_areas: str                 # İlgi alanları (örnek: "Yazılım, Veri Bilimi")
    current_knowledge_level: str       # Mevcut bilgi seviyesi (örnek: "başlangıç", "orta", "ileri")
    start_date: datetime                # Hedefin başlangıç tarihi
    target_end_date: datetime          # Hedefin tamamlanması gereken tarih

# Veritabanından dönen öğrenme hedefi nesnesi (id ile birlikte)
class LearningGoalOut(LearningGoalCreate):
    id: int                             # Veritabanında kayıtlı hedefin benzersiz kimliği

    class Config:
        orm_mode = True                # SQLAlchemy modelinden dönüş için gerekli ayar

# Öğrenme modülü oluşturmak için kullanılan istek şeması
class LearningModuleCreate(BaseModel):
    title: str                          # Modülün başlığı (örnek: "Python Temelleri")
    description: str                    # Modülün içeriği ile ilgili kısa açıklama
    category: str                       # Modülün kategorisi (örnek: "Python", "Veri Bilimi")
    order: int                          # Öğrenme sırası (modülün sıralama numarası)
    learning_outcome: str              # Kullanıcının modülü tamamladıktan sonra kazanacağı çıktı

# Öğrenme modülünü veritabanından dönerken kullanılacak çıktı modeli (id dahil)
class LearningModuleOut(LearningModuleCreate):
    id: int                             # Veritabanındaki modülün benzersiz kimliği

    class Config:
        orm_mode = True                # SQLAlchemy modeli ile uyumlu dönüş için ayar
