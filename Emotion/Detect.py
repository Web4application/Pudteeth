def detect_emotion(text):
    if "sad" in text or "tired" in text:
        return "low"
    if "excited" in text or "happy" in text:
        return "high"
    return "neutral"
