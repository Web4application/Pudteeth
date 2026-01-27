import os, time, json, feedparser
import pyttsx3, speech_recognition as sr
from pathlib import Path
from collections import Counter

# ===========================
# 0️⃣ Setup TTS & STT
# ===========================
engine = pyttsx3.init()
def speak(text):
    engine.say(text)
    engine.runAndWait()

def get_user_input(prompt="Say command"):
    r = sr.Recognizer()
    with sr.Microphone() as source:
        speak(prompt)
        audio = r.listen(source, phrase_time_limit=5)
    try:
        return r.recognize_google(audio)
    except:
        return ""

# ===========================
# 1️⃣ DLL Logging
# ===========================
DLL_FILE = "ai_DLL.json"
def log_dll(entry):
    if os.path.exists(DLL_FILE):
        with open(DLL_FILE, "r") as f:
            dll = json.load(f)
    else:
        dll = []
    dll.append(entry)
    with open(DLL_FILE, "w") as f:
        json.dump(dll, f, indent=2)

# ===========================
# 2️⃣ RSS News Fetching
# ===========================
def fetch_rss(url):
    feed = feedparser.parse(url)
    items = []
    for entry in feed.entries:
        items.append({
            "title": entry.title,
            "link": entry.link,
            "description": getattr(entry, 'summary', '')
        })
    return items

# ===========================
# 3️⃣ Summarize & Extract Topics
# ===========================
def summarize_text(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    summary = " ".join(lines[:3])
    words = [w.lower() for w in text.split() if len(w) > 4]
    freq = Counter(words)
    topics = [w for w,_ in freq.most_common(5)]
    return summary, topics

# ===========================
# 4️⃣ Scan Media & Transcripts
# ===========================
MEDIA_EXT = (".mp3", ".m4a", ".wav", ".sw", ".aac", ".flac", ".mp4", ".mov")
TRANSCRIPT_EXT = (".txt", ".srt")

def scan_media(base_folder):
    media = []
    transcripts = []
    for root, _, files in os.walk(base_folder):
        for f in files:
            path = os.path.join(root,f)
            if f.endswith(MEDIA_EXT):
                media.append(path)
            elif f.endswith(TRANSCRIPT_EXT):
                transcripts.append(path)
    return media, transcripts

# ===========================
# 5️⃣ Play Media
# ===========================
def play_media(file_path):
    speak(f"Playing {os.path.basename(file_path)}")
    time.sleep(5)  # Simulate snippet playback

# ===========================
# 6️⃣ Process Transcript
# ===========================
def process_transcript(file_path):
    with open(file_path,"r",encoding="utf-8") as f:
        text = f.read()
    summary, topics = summarize_text(text)
    speak(f"Transcript: {os.path.basename(file_path)}")
    speak(f"Summary: {summary}")
    if topics: speak(f"Topics: {', '.join(topics)}")
    log_dll({"timestamp": time.time(), "type":"transcript","file":file_path,"summary":summary,"topics":topics})

# ===========================
# 7️⃣ Unified Queue Player
# ===========================
def run_unified_ai(base_media_folder, rss_feeds, podcast_folders):
    speak("🚀 Pudteeth Unified AI Media Assistant Online!")
    while True:
        queue = []

        # ---- Live News ----
        for feed in rss_feeds:
            items = fetch_rss(feed)
            for i in items:
                summary, topics = summarize_text(i['description'] or i['title'])
                queue.append({"type":"news","title":i['title'],"summary":summary,"topics":topics,"source":feed})

        # ---- Local Media & Transcripts ----
        media, transcripts = scan_media(base_media_folder)
        for m in media:
            queue.append({"type":"media","file":m})
        for t in transcripts:
            queue.append({"type":"transcript","file":t})

        # ---- Podcast / Interview Folders ----
        for folder in podcast_folders:
            media, transcripts = scan_media(folder)
            for m in media:
                queue.append({"type":"media","file":m})
            for t in transcripts:
                queue.append({"type":"transcript","file":t})

        # ---- Play Queue ----
        for item in queue:
            if item["type"] == "news":
                speak(f"News: {item['title']}")
                speak(f"Summary: {item['summary']}")
                if item['topics']: speak(f"Topics: {', '.join(item['topics'])}")
                log_dll({"timestamp": time.time(), "type":"news","title":item['title'],"summary":item['summary'],"topics":item['topics'],"source":item['source']})
            elif item["type"] == "media":
                play_media(item['file'])
                log_dll({"timestamp": time.time(),"type":"media","file":item['file']})
            elif item["type"] == "transcript":
                process_transcript(item['file'])

            # ---- Voice Command ----
            cmd = get_user_input("Command: 'next','skip','stop','repeat','summarize','topics'")
            cmd = cmd.lower()
            if "stop" in cmd: break
            elif "skip" in cmd: continue
            elif "repeat" in cmd: queue.insert(0,item)
            elif "summarize" in cmd and item.get("type")=="transcript": process_transcript(item['file'])
            elif "topics" in cmd and item.get("type")=="transcript":
                _, topics = summarize_text(open(item['file']).read())
                speak(f"Topics: {', '.join(topics)}")

        speak("✅ Cycle complete. Next check in 5 minutes...")
        time.sleep(300)
