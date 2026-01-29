---
![pudteeth: stream.ogg](www.api.substack.com/feed/podcast/1/private/5a174370-ddfc-4a0c-b146-568f46eb6847.rss/(https://copilot.microsoft.com/shares/podcasts/Ug6GWuA79oVtHLbxzKJaG.rss
)
---

[radio public](https://api.substack.com/feed/podcast/1/private/5a174370-ddfc-4a0c-b146-568f46eb6847.rss) listen to live
![pudteeth.m4a](https://api.substack.com/feed/podcast/1/private/5a174370-ddfc-4a0c-b146-568f46eb6847.rss
)

:atom:
📻
:octocat: 


##
# Pudteeth

Pudteeth is a media automation and orchestration engine designed for audio, subtitles, narration, and system-level media control.

It combines scripting, Python logic, and media utilities to automate workflows such as:
- Audio playback & narration
- Subtitle (.srt) processing
- Text-to-media pipelines
- Media sequencing and intros
- macOS system automation (with cross-platform expansion planned)

## Features
- 🎧 Audio ingestion (wav, m4a, mp3)
- 📝 Subtitle parsing and alignment
- 🧠 Media orchestration (Mediapilot)
- 🛠 System utilities (AppleScript, Shell)
- 🧩 Modular library architecture
- 🚀 AI-ready (STT, TTS, LLMs)

## Folder Structure
- Applications/Utilities → system automation
- Lib → shared logic and helpers
- Mediapilot → media orchestration core
- Subtitle → subtitle parsing & timing
- Tools → utilities and scripts

## Use Cases
- Podcast automation
- News-to-audio pipelines
- AI narration engines
- Radio & mic output systems
- Media preprocessing for AI agents

## Status
Early-stage but functional. Actively evolving toward a full AI media engine.

## Roadmap
See ROADMAP.md


```sh

pudteeth/
├─ pudteeth/
│  ├─ __init__.py
│  ├─ main.py            # CLI entry
│  ├─ mediapilot/
│  │  ├─ __init__.py
│  │  └─ orchestrator.py
│  ├─ subtitle/
│  │  ├─ __init__.py
│  │  └─ parser.py
│  ├─ system/
│  │  ├─ __init__.py
│  │  └─ adapter.py
│  ├─ ai/
│  │  ├─ __init__.py
│  │  ├─ stt.py
│  │  ├─ tts.py
│  │  └─ llm.py
│  └─ cli/
│     ├─ play.py
│     ├─ subtitle.py
│     └─ narrate.py
│
├─ pyproject.toml
├─ README.md
├─ ROADMAP.md
└─ LICENSE
```


[stream](https://copilot.microsoft.com/shares/podcasts/Ug6GWuA79oVtHLbxzKJaG.rss)

```sh
git clone https://github.com/Web4application/Pudteeth.git
cd pudteeth

