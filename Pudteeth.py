import sys
from cli.play import play_audio
from cli.subtitle import handle_subtitles
from cli.narrate import narrate

def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else None

    if cmd == "play":
        play_audio(sys.argv[2:])
    elif cmd == "subtitle":
        handle_subtitles(sys.argv[2:])
    elif cmd == "narrate":
        narrate(sys.argv[2:])
    else:
        print("Usage: pudteeth [play|subtitle|narrate]")

if __name__ == "__main__":
    main()
