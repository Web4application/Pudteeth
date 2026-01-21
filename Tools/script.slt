
transcriber = aai.Transcriber()
audio_url = (
    "https://www.listennotes.com/e/p/accd617c94a24787b2e0800f264b7a5e/"
)
config = aai.TranscriptionConfig(speaker_labels=True)
transcript = transcriber.transcribe(audio_url, config)

text_with_speaker_labels = ""
for utt in transcript.utterances:
    text_with_speaker_labels += f"Speaker {utt.speaker}:\n{utt.text}\n"

# Count the number of unique speaker labels
unique_speakers = set(utterance.speaker for utterance in transcript.utterances)
questions = []
for speaker in unique_speakers:
    questions.append(
        aai.LemurQuestion(
        question=f"Who is speaker {speaker}?",
        answer_format="<First Name> <Last Name (if applicable)>")
    )
result = aai.Lemur().question(
    questions,
    input_text=text_with_speaker_labels,
    final_model=aai.LemurModel.claude3_5_sonnet,
    context="Your task is to infer the speaker's name from the speaker-labelled transcript"
)

for qa_response in result.response:
    pattern = r"Who is speaker (\w)\?"
    match = re.search(pattern, qa_response.question)
    if match and match.group(1) not in speaker_mapping.keys():
        speaker_mapping.update({match.group(1): qa_response.answer})


Print the Transcript with Speaker Names:

for utterance in transcript.utterances[:10]:
   speaker_name = speaker_mapping[utterance.speaker]
   print(f"{speaker_name}: {utterance.text[:50]}...")
