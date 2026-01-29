---
:Documentation:
:STAND-ALONE.md:
---


# 🦷 PUDTEETH — STAND-ALONE APP (MASTER PLAN)


🧠 What You’re Building (Clear Sentence)

Pudteeth is a local-first, AI-powered media production app where creators manage podcasts end-to-end: record, edit, automate, publish — all inside one app.

That’s the product. Everything below serves this.

# ⸻ #


🗂️ 1️⃣ CANONICAL PROJECT STRUCTURE

This is the final shape. You can grow into it safely.

--
```
pudteeth/
├── app/                    # Frontend (Tauri + React)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── stores/
│   │   └── api/
│   └── tauri.conf.json
│
├── backend/                # FastAPI backend
│   ├── main.py
│   ├── api/
│   │   ├── podcasts.py
│   │   ├── episodes.py
│   │   ├── media.py
│   │   └── ai.py
│   ├── engine/             # Your existing Pudteeth logic
│   │   ├── ai/
│   │   ├── mediapilot/
│   │   ├── subtitle/
│   │   └── audio/
│   ├── jobs/
│   ├── models/
│   └── storage/
│
├── projects/               # User projects (local-first)
│   └── raw-signals/
│       ├── episodes/
│       ├── assets/
│       └── rss.xml
│
├── scripts/
├── README.md
└── pyproject.toml
--
```

🧠 :Rule:

Everything the user does = a project.
No loose files. No chaos.

⸻

⚙️ 2️⃣ [:BACKEND:](FASTAPI AS THE BRAIN)

Your backend is the single source of truth.

Core responsibilities:
	•	Audio processing
	•	AI tasks
	•	File orchestration
	•	RSS generation
	•	Automation pipelines

[pudteeth](main.py)
```
from fastapi import FastAPI
from api import podcasts, episodes, media, ai

app = FastAPI(title="Pudteeth Engine")

app.include_router(podcasts.router, prefix="/podcasts")
app.include_router(episodes.router, prefix="/episodes")
app.include_router(media.router, prefix="/media")
app.include_router(ai.router, prefix="/ai")
```


⸻

🎧 3️⃣ [:INTERNAL_DATA_MODEL:] (SIMPLE & STRONG)

Podcast
	•	id
	•	name
	•	description
	•	cover
	•	rss_settings

Episode
	•	id
	•	podcast_id
	•	raw_audio
	•	processed_audio
	•	transcript
	•	status

Asset
	•	audio
	•	subtitle
	•	image
	•	metadata

⸻

🖥️ 4️⃣ [:STAND_ALONE_APP:](Vite.dev:ELECTRONdev)

Why Tauri?
	•	Tiny binaries
	•	Native speed
	•	Uses system APIs
	•	Python backend runs locally

UI Sections (NON-NEGOTIABLE)
	•	Dashboard
	•	Podcast View
	•	Episode Studio
	•	Automation
	•	Settings

Each is a '`route`. Each talks to `FastAPI`.

⸻

🤖 5️⃣ [:AI_WORKFLOWS:](pudteeth/ai/)

One-click :actions:
	•	Transcribe episode
	•	Generate intro narration
	•	Summarize episode
	•	Generate title + description
	•	Create subtitles
	•	Normalize audio

[Behind_the_scenes](pudteeth/mediapilot/)
`Audio → STT → Transcript → LLM → Output`

>
>User sees buttons, not pipelines.

⸻

📡 6️⃣ [PUBLISHING](pudteeth.app/BUILT-IN_NOT_EXTERNAL/)

`Pudteeth generates:
	•	rss.xml
	•	episode metadata
	•	enclosure URLs (local or hosted)`

	•	Substack sync
	•	Spotify submission
	•	Private feeds

But RSS first. Always.


🔐 7️⃣ [LOCAL](pudteeth/docs/FIRST_PHILOSOPHY)

`This is important.
	•	Works offline
	•	Files live on user machine
	•	API keys owned by user
	•	 cloud`


🚀 8️⃣ # MVP YOU SHOULD BUILD FIRST (NO EXCUSES)

Week 1
	•	Project creation
	•	Audio upload
	•	Transcript generation

Week 2
	•	Intro/outro automation
	•	Episode export
	•	Simple RSS

Week 3
	•	UI polish
	•	Raw Signals podcast fully produced inside Pudteeth

Dogfood it.

⸻

🧠 :STRAIGHT_TRUTH:
 
 `making “another podcast app”You’re making:


That’s rare. That’s valuable.
`
⸻

NEXT — 



1️⃣ 

# Full FastAPI endpoints real [install.md](https://web4application.github.io/pudteeth/Docs/index.html)

2️⃣ [Tauri + React starter scaffold](https://web4application.github.io/pudteeth/Docs/index.html)
[install.md](https://web4application.github.io/pudteeth/Docs/index.html)

3️⃣ :Episode: 
:processing: 
:pipeline:
4️⃣ :RSS: generator implementation
5️⃣ Product README + contributor guide

