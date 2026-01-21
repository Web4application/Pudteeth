#!/usr/bin/env bash

# Rename .m4a files using metadata (Artist - Title.m4a)
# Requires: pip install mutagen

shopt -s nullglob

for file in *.m4a; do
    meta=$(mutagen-inspect "$file")

    ARTIST=$(echo "$meta" | grep -m1 "ART=" | sed 's/.*=//')
    TITLE=$(echo "$meta" | grep -m1 "nam=" | sed 's/.*=//')

    # Fallbacks if metadata is missing
    ARTIST=${ARTIST:-Unknown Artist}
    TITLE=${TITLE:-Unknown Title}

    # Sanitize filename
    SAFE_ARTIST=$(echo "$ARTIST" | tr '/:*?"<>|' '_')
    SAFE_TITLE=$(echo "$TITLE" | tr '/:*?"<>|' '_')

    NEW_NAME="$SAFE_ARTIST - $SAFE_TITLE.m4a"

    # Avoid overwriting files
    if [[ -e "$NEW_NAME" ]]; then
        echo "⚠️ Skipping (already exists): $NEW_NAME"
        continue
    fi

    mv "$file" "$NEW_NAME"
    echo "✅ Renamed: $file → $NEW_NAME"
done
