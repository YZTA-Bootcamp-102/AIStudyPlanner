import os
import google.generativeai as genai
import json
from dotenv import load_dotenv
from backend.schemas.learning import LearningModuleCreate
import re  # Metin temizleme için re modülünü ekledik

load_dotenv()

# API Anahtarınızı ortam değişkeninden alın
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni eksik.")

# Gemini API'sini anahtarınızla yapılandırın
genai.configure(api_key=GEMINI_API_KEY)


def generate_learning_modules(goal_text: str, interest_areas: str, level: str) -> list[LearningModuleCreate]:
    """
    Kullanıcının hedeflerine, ilgi alanlarına ve seviyesine göre
    Gemini API kullanarak öğrenme modülleri oluşturur.
    """
    # Model olarak 'gemini-1.5-flash' kullanıyoruz, daha yeni ve verimli bir model.
    model = genai.GenerativeModel('gemini-1.5-flash')

    # Prompt'u daha net hale getirdik ve sadece JSON istediğimizi belirttik.
    prompt_text = f"""
    Sen bir eğitim içeriği oluşturma asistanısın.
    Kullanıcının hedefi: "{goal_text}"
    İlgi alanları: "{interest_areas}"
    Seviyesi: "{level}"

    Bu bilgiler ışığında, kullanıcının hedefine ulaşmasını sağlayacak 2 ile 4 arasında öğrenme modülü oluştur.
    Her modül şu alanları içermelidir: "title", "description", "category", "order", "learning_outcome".
    Yanıt olarak SADECE ve SADECE bir JSON dizisi (array) döndür. Başka hiçbir metin, açıklama veya markdown formatı ekleme.
    """

    try:
        # GenerationConfig'e response_mime_type ekleyerek modelin JSON formatında
        # çıktı vermesini sağlıyoruz. Bu, en güvenilir yöntemdir.
        response = model.generate_content(
            prompt_text,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=2048,  # Olası kesintileri önlemek için token limitini artırdık
                temperature=0.7,
                response_mime_type="application/json",  # Modelin JSON döndürmesini zorunlu kılar
            )
        )

        text_response = response.text

        # Hata ayıklama için API'den gelen ham yanıtı yazdıralım
        print("--- Gemini API Raw Response ---")
        print(text_response)
        print("-----------------------------")

        # response_mime_type kullanıldığında genellikle temizleme gerekmez,
        # ancak ne olur ne olmaz diye bir temizleme adımı bırakmakta fayda var.
        # Bu kod, yanıtın içinde gömülü olabilecek bir JSON bloğunu bulup çıkarır.
        # Örneğin ```json ... ``` gibi bir yapı varsa temizler.
        match = re.search(r'```(json)?(.*)```', text_response, re.DOTALL)
        if match:
            # Markdown bloğunun içindeki içeriği al
            json_str = match.group(2).strip()
        else:
            # Markdown yoksa, doğrudan metni kullan
            json_str = text_response.strip()

        # Temizlenmiş metni JSON olarak ayrıştır
        module_dicts = json.loads(json_str)

        # Sözlük listesini Pydantic modellerine dönüştür
        return [LearningModuleCreate(**module) for module in module_dicts]

    except json.JSONDecodeError as e:
        # JSON ayrıştırma hatası olursa, daha açıklayıcı bir hata mesajı verelim
        error_message = f"JSON Decode Hatası: {e}. AI'dan gelen yanıt geçerli bir JSON değildi. Gelen Yanıt: '{text_response}'"
        print(error_message)
        raise ValueError(error_message) from e

    except Exception as e:
        # Diğer tüm olası hataları yakala
        # `response` değişkeninin bu scope'ta var olup olmadığını kontrol et
        raw_response_text = "N/A"
        if 'response' in locals() and hasattr(response, 'text'):
            raw_response_text = response.text

        error_message = f"AI'dan gelen yanıt işlenemedi veya API hatası oluştu: {e}. Gelen Yanıt: '{raw_response_text}'"
        print(error_message)
        raise ValueError(error_message) from e