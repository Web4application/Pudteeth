from mutagen.mp4 import MP4

# Load your M4A file
audio = MP4("script.m4a")

# Map of common M4A tags
audio["\xa9nam"] = "Project Script"       # Title
audio["\xa9ART"] = "AI Voice Assistant"   # Artist
audio["\xa9alb"] = "Transcription Series" # Album
audio["\xa9day"] = "2026"                 # Year
audio["\xa9cmt"] = "Generated from SRT"   # Comment

# Save the tags back to the file
audio.save()
print("Metadata successfully updated!")
