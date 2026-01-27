# ==============================
# Pudteeth 24/7 Voice-First AI Script
# Author: KUBU LEE
# Format: .sw (workflow & orchestration)
# ==============================

# 1️⃣ Live News RSS Feeds
RSS_FEEDS = [
    "https://rss.cnn.com/rss/edition.rss",
    "https://feeds.bbci.co.uk/news/rss.xml",
    "https://www.reuters.com/rssFeed/business-finance",
    "https://www.npr.org/rss/podcast"
]

# 2️⃣ Local Pudteeth Media Folder
LOCAL_MEDIA = "/path/to/Pudteeth/media"

# 3️⃣ Podcast & Interview Folders
PODCAST_FOLDERS = [
    "/path/to/podcasts",
    "/path/to/interviews"
]

# 4️⃣ Supported File Extensions
MEDIA_EXTENSIONS = [
    ".mp3", ".m4a", ".wav", ".sw", ".aac", ".flac", ".mp4", ".mov"
]
TRANSCRIPT_EXTENSIONS = [".txt", ".srt"]

# 5️⃣ Playback Settings
PLAYBACK_SNIPPET_DURATION = 10  # seconds per media snippet
CHECK_INTERVAL = 300            # 5 minutes between cycles

# 6️⃣ Voice Commands
VOICE_COMMANDS = {
    "next": "skip current item",
    "skip": "skip current item",
    "stop": "pause loop",
    "repeat": "repeat current item",
    "summarize": "read summary of transcript",
    "topics": "list topics of transcript"
}

# 7️⃣ Logging
DLL_FILE = "ai_DLL.json"
LOG_FORMAT = ["timestamp","type","file/title","summary","topics","source"]

# ==============================
# 8️⃣ Workflow
# ==============================
while True:

    # --- Step 1: Fetch Live News ---
    for feed in RSS_FEEDS:
        news_items = fetch_rss(feed)
        for news in news_items:
            queue.append({
                "type":"news",
                "title": news.title,
                "description": news.description,
                "source": feed
            })

    # --- Step 2: Scan Local Media ---
    media_files, transcript_files = scan_folders(LOCAL_MEDIA)
    for f in media_files:
        queue.append({"type":"media","file":f})
    for t in transcript_files:
        queue.append({"type":"transcript","file":t})

    # --- Step 3: Scan Podcasts / Interviews ---
    for folder in PODCAST_FOLDERS:
        media, transcripts = scan_folders(folder)
        for m in media:
            queue.append({"type":"media","file":m})
        for tr in transcripts:
            queue.append({"type":"transcript","file":tr})

    # --- Step 4: Play Queue ---
    for item in queue:
        if item.type == "news":
            speak(f"News: {item.title}")
            speak(f"Summary: {item.description[:150]}...")  # short snippet
            log_dll({"timestamp": now(), "type":"news","title":item.title,"summary":item.description,"source":item.source})

        elif item.type == "media":
            play_media(item.file)
            log_dll({"timestamp": now(),"type":"media","file":item.file})

        elif item.type == "transcript":
            summary, topics = summarize_transcript(item.file)
            speak(f"Transcript: {basename(item.file)}")
            speak(f"Summary: {summary}")
            if topics: speak(f"Topics: {', '.join(topics)}")
            log_dll({"timestamp": now(), "type":"transcript","file":item.file,"summary":summary,"topics":topics})

        # --- Step 5: Voice Commands ---
        cmd = get_user_input("Command: next, skip, stop, repeat, summarize, topics")
        if cmd.lower() == "stop": break
        elif cmd.lower() in ["next","skip"]: continue
        elif cmd.lower() == "repeat": queue.insert(0,item)
        elif cmd.lower() == "summarize" and item.type=="transcript": summarize_transcript(item.file)
        elif cmd.lower() == "topics" and item.type=="transcript": speak(f"Topics: {', '.join(topics)}")

    speak("Cycle complete. Waiting 5 minutes before next check...")
    sleep(CHECK_INTERVAL)
