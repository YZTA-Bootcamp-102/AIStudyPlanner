# Bu script, SQLAlchemy modellerinizden bir Graphviz DOT dosyası oluşturur.
# DOT dosyası, daha sonra Graphviz programı (dot komutu) ile bir resme dönüştürülebilir.

from backend.database import Base # Kendi Base sınıfınızın yolu
from sqlalchemy import create_engine
import os
import sys

# Kendi modellerinizin bulunduğu dosyayı buraya import edin.
# Bu liste sizin models.py dosyanızdaki tüm model sınıflarını içermeli.
from backend.models import (
    User, LearningModule, DailyTask, Reminder, Progress, AIHint, SprintPlan,
    CalendarIntegration, WeeklyReview, LearningGoal, LevelQuestion,
    LevelQuestionOption, LevelAnswer, StudySession, MindmapNode, AIConversation
)

# Geçici bir SQLite veritabanı motoru oluştur
# Şema oluşturmak için gerçek bir veritabanına bağlanmak zorunda değilsiniz,
# sadece modelleri yansıtmak için bir motor yeterli.
# 'sqlite:///:memory:' bellek içi bir veritabanıdır, dosyaya yazılmaz.
engine = create_engine('sqlite:///:memory:')

# Tüm tabloları bellekteki geçici veritabanında oluştur (sadece metadata için)
try:
    Base.metadata.create_all(engine)
    print("Modeller bellekteki geçici veritabanına başarıyla yansıtıldı.")
except Exception as e:
    print(f"Hata: Modeller geçici veritabanına yansıtılırken bir sorun oluştu: {e}")
    sys.exit(1) # Script'i hatayla sonlandır

# --- DOT Dosyasını Oluştur ---
dot_output_filename = 'AIStudyPlanner_Database_Schema.dot'
dot_output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), dot_output_filename)

# Graphviz DOT formatında çıktıyı manuel olarak oluşturalım
dot_content = ['digraph G {']
dot_content.append('  rankdir="LR";') # Düzen yönü: Soldan Sağa

# Her tablo için bir düğüm oluştur
for table in Base.metadata.sorted_tables:
    table_name = table.name
    dot_content.append(f'  "{table_name}" [shape=box, label=<<table border="0" cellborder="1" cellspacing="0" cellpadding="4">')
    dot_content.append(f'    <tr><td colspan="2" bgcolor="lightblue"><b>{table_name}</b></td></tr>')

    for column in table.columns:
        column_name = column.name
        column_type = str(column.type)
        is_pk = "PK" if column.primary_key else ""
        is_fk = "FK" if column.foreign_keys else ""
        pk_html = f"<font color='red'>{is_pk}</font>" if is_pk else ""
        fk_html = f"<font color='green'>{is_fk}</font>" if is_fk else ""
        keys_info = f"{pk_html} {fk_html}".strip() # Boşlukları temizle
        dot_content.append(f'    <tr><td align="left">{column_name}</td><td align="left">{column_type} {keys_info}</td></tr>')
    dot_content.append('  </table>>];')

# İlişkileri (ForeignKey'ler) çiz
for table in Base.metadata.sorted_tables:
    for column in table.columns:
        for fk in column.foreign_keys:
            # Sütun -> Hedef Tablo arasındaki ilişkiyi çiz
            source_table = table.name
            target_table = fk.column.table.name
            dot_content.append(f'  "{source_table}" -> "{target_table}" [label="{column.name}"];')

dot_content.append('}')

try:
    with open(dot_output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(dot_content))
    print(f"Graphviz DOT dosyası '{dot_output_path}' başarıyla oluşturuldu!")

except Exception as e:
    print(f"DOT dosyası oluşturulurken hata oluştu: {e}")
    sys.exit(1)