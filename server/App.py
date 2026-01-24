from fastapi import FastAPI
from pudteeth.ai.s2s import live_loop

app = FastAPI()

@app.post("/speak")
def speak():
    live_loop("mic")
    return {"status": "speaking"}
