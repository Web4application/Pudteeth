audio1 = AudioSegment.from_file("part1.m4a")
audio2 = AudioSegment.from_file("part2.m4a")

# Combine them (concatenation)
combined = audio1 + audio2
combined.export("full_audio.m4a", format="m4a")
