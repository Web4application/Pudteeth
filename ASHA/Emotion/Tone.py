def adapt(text, emotion):
    if emotion == "low":
        return "soft"
    if emotion == "high":
        return "energetic"
    return "normal"
