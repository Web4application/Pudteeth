import argparse
from pudteeth.cli.play import play_audio
from pudteeth.cli.subtitle import run_subtitle
from pudteeth.cli.narrate import narrate_text

def main():
    parser = argparse.ArgumentParser(prog="pudteeth")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("play")
    sub.add_parser("subtitle")
    sub.add_parser("narrate")

    args, extra = parser.parse_known_args()

    if args.cmd == "play":
        play_audio(extra)
    elif args.cmd == "subtitle":
        run_subtitle(extra)
    elif args.cmd == "narrate":
        narrate_text(extra)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
