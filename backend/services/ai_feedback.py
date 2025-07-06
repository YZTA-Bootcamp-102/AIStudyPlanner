from typing import Tuple

def get_motivation_message(rate: float) -> Tuple[str, str]:
    """
    Kullanıcının tamamladığı modül oranına göre uygun motivasyon mesajı ve emoji/başlık döner.

    Args:
        rate (float): Kullanıcının ilerleme yüzdesi (0–100 arası).

    Returns:
        Tuple[str, str]: (emoji & başlık + mesaj içeriği)
    """
    if rate >= 90:
        title = "⚡ Mükemmel!"
        message = "İlerlemen %100’e çok yakın, motivasyonun üst düzeyde!"
    elif rate >= 75:
        title = "🎯 Çok İyi!"
        message = "Harika iş çıkarıyorsun — biraz daha artırsan tamamlarsın."
    elif rate >= 50:
        title = "👍 İyi Başlangıç!"
        message = "Güzel gidiyorsun, düzenli çalışırsan çok daha iyi olur."
    else:
        title = "🔔 Devam Et!"
        message = "Henüz yolun başındasın — istikrarlı şekilde ilerle!"
    return title, message
