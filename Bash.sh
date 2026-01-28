https://github.com/Web4application/Pudteeth.git
cd pudteeth
curl https://api.github.com
audiotidy organize ./music --by artist album
audiotidy rename *.m4a --format "{artist} - {title}" 
audiotidy dev ./audio --dry-run --json
audiotidy dataset ./raw_audio
audiotidy archive ./media --rules rules.yaml

```pudteeth
audiotidy/
├── core/          # metadata, safety, rules
├── modes/         # music, creator, dev, dataset
├── cli/
├── api/
├── ui/
├── configs/
├── tests/
└── docs/

pip install -e .
pudteeth play intro.wav
pudteeth subtitle file.srt
pudteeth narrate article.txt
mediapilot podcast script.md --voice female_en --music intro.mp3
mediapilot news --source rss --interval 60min
mediapilot video script.txt --format youtube 

```pudteeth
mediapilot/
├── ingest/        # scripts, audio, video, RSS
├── intelligence/  # ordering, timing, logic
├── tts/           # text → speech
├── asr/           # speech → text
├── audio/         # mixing, routing
├── video/         # visuals, captions
├── output/
│   ├── podcast/
│   ├── radio/
│   ├── screen/
│   └── stream/
├── scheduler/
└── api/

vlc script.m4a --sub-file script.srt
 install pydub (Audio Conversion)
pip install gTTS (Text-to-Speech)
pip install python-docx (Word documents)

pudteeth play intro.wav
pudteeth subtitle input.srt
pudteeth narrate article.txt

```pudteeth
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
--
# Standard installation
pip install speechmatics-voice

# With SMART_TURN (ML-based turn detection)
pip install speechmatics-voice[smart]
