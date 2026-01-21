from gtts import gTTS

# Read text from a file
with open("script.txt", "r") as f:
    text = f.read()

# Generate speech
tts = gTTS(text=text, lang='en')
tts.save("speech.m4a") # Saves as M4A-compatible MP3/AAC
