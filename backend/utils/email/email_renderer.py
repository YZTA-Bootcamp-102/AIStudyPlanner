import os
from jinja2 import Environment, FileSystemLoader

# Şablonların bulunduğu dizinleri tanımla
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")

# Jinja2 ortamını oluştur
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

def render_template(template_name: str, context: dict) -> str:
    """
    Verilen template dosyasını ve context verisini kullanarak HTML döner.

    Args:
        template_name (str): Kullanılacak Jinja2 template dosya adı.
        context (dict): Şablon içinde kullanılacak veriler.

    Returns:
        str: Render edilmiş HTML çıktısı.
    """
    template = env.get_template(template_name)
    return template.render(**context)
