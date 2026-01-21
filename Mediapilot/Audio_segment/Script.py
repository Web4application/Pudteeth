from pydub import AudioSegment

# Load M4A and export as WAV
audio = AudioSegment.from_file("script.m4a", format="m4a")
audio.export("output.wav", format="wav")
print("Conversion to WAV complete.")
