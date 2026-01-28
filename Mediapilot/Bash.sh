curl https://api.assemblyai.com/v2/transcript \
  --header 'Authorization: <ac779ff6479e4cb9b8aa23c877876043>'
                 +------------------+
                 |  Input Media     |
                 |------------------|
                 | News/ Podcast/   |
                 | Radioshows/      |
                 +--------+---------+
                          |
                          v
                 +------------------+
                 |   Config YAML    |
                 |------------------|
                 | Config/          |
                 | Jobs.yaml        |
                 | Project.yaml     |
                 +--------+---------+
                          |
                          v
                 +------------------+
                 |  MediapiLot Core |
                 |------------------|
                 | Mediapilot/      |
                 | Async Orchestration|
                 +--------+---------+
                          |
          +---------------+----------------+
          |               |                |
          v               v                v
   +------------+   +------------+   +------------+
   |   STT      |   |   TTS      |   |   NLP/AI  |
   | ai/        |   | ai/        |   | ai/ Emotion/|
   | whisper.py |   | tts_gpt.py |   | Lang/ASHA/ |
   +-----+------+   +-----+------+   +-----+------+
         |                |                |
         v                v                v
  +------------------------------------------------+
  | Subtitle / Transcript / Metadata Generation  |
  |-----------------------------------------------|
  | Subtitle/ (.srt, .txt)                        |
  | Memory/ (state, history, job logs)           |
  +----------------+----------------------------+
                   |
                   v
          +--------------------+
          | Post-processing    |
          |--------------------|
          | Lib/ Tools/ DLL/   |
          | Audio/Video Encode |
          +---------+----------+
                    |
                    v
          +--------------------+
          |   Output Media     |
          |--------------------|
          | Memory/Processed/  |
          | Final Audio/Video  |
          +--------------------+
                    |
                    v
          +--------------------+
          |   Server / API     |
          |--------------------|
          | server/            |
          | Remote Control     |
          | Monitoring         |
          +--------------------+
                    |
                    v
                +-------+
                |   UI  |
                | ui/   |
                +-------+
