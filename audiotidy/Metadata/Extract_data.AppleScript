from mutagen.mp4 import MP4

def edit_m4a_tags(filename, title, artist):
    audio = MP4(filename)
    audio.tags["\xa9nam"] = title   # Title tag
    audio.tags["\xa9ART"] = artist  # Artist tag
    audio.save()

edit_m4a_tags("script.m4a", "Project Title", "Voice Actor Name")
