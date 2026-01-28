from speechmatics.voice import SpeakerIdentifier

config = VoiceAgentConfig(
  enable_diarization=True,
  known_speakers=[
      SpeakerIdentifier(label="Alice", speaker_identifiers=["XX...XX"]),
      SpeakerIdentifier(label="Bob", speaker_identifiers=["YY...YY"])
  ]
)
