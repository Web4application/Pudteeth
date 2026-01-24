from pudteeth.ai.stt import speech_to_text
from pudteeth.ai.llm import respond
from pudteeth.ai.tts import text_to_speech

def live_loop(audio_input):
    text = speech_to_text(audio_input)
    reply = respond(text)
    text_to_speech(reply)
