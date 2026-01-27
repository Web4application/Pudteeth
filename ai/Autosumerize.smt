import assemblyai as aai
import requests
import os

# Ensure your API key is set, e.g.:
# aai.settings.api_key = "YOUR_API_KEY"

transcriber = aai.Transcriber()
transcript = transcriber.transcribe("https://storage.googleapis.com/aai-web-samples/meeting.mp3")

if transcript.status == aai.TranscriptStatus.error:
   raise Exception(f'Transcription error: {transcript.error}')

prompt = f"""
You are an expert at summarizing meetings.
Provide a summary of the following transcript, which is from a GitLab meeting to discuss logistics.

Format the summary with markdown, using the following structure for each topic:
**<topic header>**
<topic summary>

Transcript:
{transcript.text}
"""

api_key = os.getenv("ASSEMBLYAI_API_KEY") or aai.settings.api_key

response = requests.post(
   "https://llm-gateway.assemblyai.com/v1/chat/completions",
   headers={"authorization": api_key},
   json={
       "model": "claude-3-5-haiku-20241022",
       "messages": [
           {"role": "user", "content": prompt}
       ],
   }
)

result = response.json()
print(result['choices'][0]['message']['content'])
