from speechmatics.voice import AdditionalVocabEntry

config = VoiceAgentConfig(
  language="en",
  additional_vocab=[
      AdditionalVocabEntry(
          content="Speechmatics",
          sounds_like=["speech matters", "speech matics"]
      ),
      AdditionalVocabEntry(content="API"),
  ]
)
