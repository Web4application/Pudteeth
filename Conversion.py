import whisper
from whisper.utils import get_writer
import os

# Load model (tiny, base, small, medium, large)
model = whisper.load_model("base")
audio = "script.m4a"
result = model.transcribe(audio)

# Define output formats
output_dir = "./"
formats = ["srt", "txt"]

for fmt in formats:
    writer = get_writer(fmt, output_dir)
    writer(result, audio)

# Simple TXT to DOCX (requires: pip install python-docx)
from docx import Document
doc = Document()
doc.add_paragraph(result["text"])
doc.save("script.docx")
