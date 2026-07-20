"""Generate the 'kingdom-creative' placeholder image set via Imagen 4.

Shared aesthetic: molten orange/red emissive glow objects on pure black,
cinematic photorealistic 3D renders -> composite seamlessly onto dark slides.

Usage: python gen_images.py
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / "backend" / ".env")
from google import genai
from google.genai import types

OUT = Path(__file__).parent / "public" / "generated"
OUT.mkdir(parents=True, exist_ok=True)

STYLE = (
    ", molten glowing orange and red emissive light, on a pure solid black background, "
    "cinematic dramatic studio lighting, photorealistic high-detail 3D render, dark moody "
    "atmosphere, subtle smoke and floating embers, premium, no text"
)

# (filename, aspect_ratio, prompt)
IMAGES = [
    ("cover-diamond-hand", "3:4",
     "A polished liquid chrome metal robotic hand reaching up holding a single brilliant "
     "glowing molten-orange faceted diamond gemstone, a dark planet Earth in deep space behind it"),
    ("prev-post-card", "3:4",
     "An abstract burst of glowing orange paint and light, dark artistic creative composition, "
     "energetic splashes"),
    ("brain-column", "3:4",
     "A glowing molten-orange human brain resting on top of an ornate carved silver chrome "
     "classical Corinthian column pedestal"),
    ("hands-light", "3:4",
     "Two human hands cupped together gently holding a radiant ball of molten orange light "
     "and glowing embers"),
    ("figure-trail", "3:4",
     "A lone silhouetted person standing at the far end of a long glowing orange trail of "
     "sparks and light running along the ground, vast dark empty void, cinematic depth"),
    ("crown", "3:4",
     "A single regal royal crown floating in the air, molten lava texture, intense fiery glow"),
    ("outro-leap", "16:9",
     "Silhouettes of two people leaping across a gap between two dark cliffs, dramatic glowing "
     "orange and yellow sunset sky behind them, cinematic wide landscape shot"),
]

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

only = sys.argv[1] if len(sys.argv) > 1 else None
for name, ratio, prompt in IMAGES:
    if only and only != name:
        continue
    try:
        resp = client.models.generate_images(
            model="imagen-4.0-generate-001",
            prompt=prompt + STYLE,
            config=types.GenerateImagesConfig(number_of_images=1, aspect_ratio=ratio),
        )
        data = resp.generated_images[0].image.image_bytes
        (OUT / f"{name}.png").write_bytes(data)
        print(f"OK  {name}.png ({ratio}) -> {len(data)} bytes")
    except Exception as e:
        print(f"ERR {name}: {repr(e)[:200]}")
