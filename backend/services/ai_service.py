import os
import google.generativeai as genai
import json
from dotenv import load_dotenv
from backend.schemas.learning import LearningModuleCreate
import re
from typing import List
from typing import Dict
import google.generativeai as genai
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY ortam değişkeni eksik.")

genai.configure(api_key=GEMINI_API_KEY)


def generate_learning_modules(goal_text: str, interest_areas: str, level: str) -> List[LearningModuleCreate]:
    """
    Kullanıcının hedeflerine, ilgi alanlarına ve seviyesine göre
    Gemini API kullanarak öğrenme modülleri oluşturur.
    """

    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt_text = f"""
    Sen bir eğitim içeriği oluşturma asistanısın.
    Kullanıcının hedefi: "{goal_text}"
    İlgi alanları: "{interest_areas}"
    Seviyesi: "{level}"

    Bu bilgiler ışığında, kullanıcının hedefine ulaşmasını sağlayacak 2 tane öğrenme modülü oluştur.
    Her modül şu alanları içermelidir: "title", "description", "category", "order", "learning_outcome".
    Yanıt olarak SADECE ve SADECE bir JSON dizisi (array) döndür. Başka hiçbir metin, açıklama veya markdown formatı ekleme.
    """

    try:
        response = model.generate_content(
            prompt_text,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=2048,
                temperature=0.7,
                response_mime_type="application/json",
            )
        )

        text_response = response.text

        print("--- Gemini API Raw Response ---")
        print(text_response)
        print("-----------------------------")

        # Markdown kod bloğu varsa çıkar
        match = re.search(r'```(?:json)?\s*(.*?)\s*```', text_response, re.DOTALL)

        if match:
            json_str = match.group(2).strip()
        else:
            json_str = text_response.strip()

        module_dicts = json.loads(json_str)

        return [LearningModuleCreate(**module) for module in module_dicts]

    except json.JSONDecodeError as e:
        error_message = f"JSON Decode Hatası: {e}. AI'dan gelen yanıt geçerli JSON değil. Yanıt: '{text_response}'"
        print(error_message)
        raise ValueError(error_message) from e

    except Exception as e:
        raw_response_text = "N/A"
        if 'response' in locals() and hasattr(response, 'text'):
            raw_response_text = response.text
        error_message = f"AI yanıtı işlenemedi veya API hatası: {e}. Yanıt: '{raw_response_text}'"
        print(error_message)
        raise ValueError(error_message) from e


def generate_ai_response(user_input: str) -> str:
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""
    Kullanıcı: "{user_input}"

    Bu soruya ya da mesaja detaylı ama sade bir şekilde cevap ver.
    Gereksiz açıklamalar ve tekrarlar olmasın. Direkt cevaba odaklan.
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("AI yanıt üretim hatası:", e)
        return "Şu anda yanıt verilemiyor."

def generate_study_plan_from_answers(goal_data: Dict[str, str]) -> str:
    """
    Kullanıcı cevaplarını hedef formatında alır ve kişiselleştirilmiş çalışma planı oluşturur.
    """

    prompt = f"""
    Sen deneyimli bir eğitim danışmanısın.

    Kullanıcı çalışma planı oluşturmak istiyor.
    Hedef Bilgileri:

    - Hedef Adı: {goal_data['goal_text']}
    - Plan Türü: {goal_data['title']}
    - İlgi Alanları: {goal_data['interest_areas']}
    - Mevcut Seviye: {goal_data['current_knowledge_level']}
    - Başlangıç Tarihi: {goal_data['start_date']}
    - Hedef Bitiş Tarihi: {goal_data['target_end_date']}

    Kullanıcı için detaylı bir çalışma planı hazırla:
    1. Günlük / haftalık çalışma saatleri
    2. Ders / konu bazlı dağılım
    3. Motivasyon ve verimlilik ipuçları
    4. Hedefe ulaşma yol haritası

    Yanıtı sade ve açıklayıcı bir metin olarak döndür.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            candidate_count=1,
            max_output_tokens=1200,
            temperature=0.7,
        )
    )

    return response.text.strip()
