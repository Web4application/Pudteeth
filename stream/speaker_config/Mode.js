from speechmatics.voice import SpeakerFocusConfig, SpeakerFocusMode

# Focus only on specific speakers
config = VoiceAgentConfig(
  enable_diarization=True,
  speaker_config=SpeakerFocusConfig(
      focus_speakers=["S1", "S2"],
      focus_mode=SpeakerFocusMode.RETAIN
  )
)

# Ignore specific speakers
config = VoiceAgentConfig(
  enable_diarization=True,
  speaker_config=SpeakerFocusConfig(
      ignore_speakers=["S3"],
      focus_mode=SpeakerFocusMode.IGNORE
  )
)
