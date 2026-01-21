set the_radio_show_name to “Program Name”
set the_radio_show_length to 1 –in hours
set the_padding to 5 –in seconds; you might want to pad a few extra seconds

set target_playlist to “Recorded Shows”
set main_library to “Library”

set music_path to ((path to “cusr” as string) & “Music:”)

set WireTaps_save_location to (music_path & “WireTap Recordings:”) –set this to WireTap’s save location in WireTap Prefs
set WireTaps_prefix to “show” –set this to WireTap’s prefix in WireTap Prefs

set current_date to (do shell script “date +%m-%d-%y”)
set the_file_name to the_radio_show_name & " " & current_date

tell application “iTunes”
if (mute) then set mute to false
set volume 5
set the_playlist to playlist “Radio Programs”
set shuffle of the_playlist to false
play track 1 of the_playlist
end tell

tell application “WireTap” to start recording

do shell script ("sleep " & ((the_radio_show_length * hours) + the_padding)) –better than delay

tell application “WireTap”
stop recording
try
quit
end try
end tell

tell application “iTunes” to stop

tell application “Finder”
set source_file to (WireTaps_save_location & WireTaps_prefix & “001.aiff”)
set name of file source_file to (the_file_name & “.aiff”)
set source_file to (WireTaps_save_location & the_file_name & “.aiff”) as alias
end tell

tell application “iTunes”
set the_aiff_ref to add {source_file} to playlist main_library
with timeout of (5 * hours) seconds
set the_converted_track_ref to convert the_aiff_ref –set the conversion prefs in iTunes
end timeout
delete the_aiff_ref
set the_track to (item 1 of the_converted_track_ref)
tell the_track
set name to the_file_name
set album to the_radio_show_name
set artist to “”
set genre to “Radio Show”
set comment to "Recorded on " & current_date
set year to ((do shell script “date +%Y”) as integer)
set converted_location to location
end tell
if (exists of playlist target_playlist) = false then make new playlist with properties {name:target_playlist}
add {converted_location} to playlist target_playlist
end tell

do shell script ("rm " & (quoted form of POSIX path of source_file)) –kill the .aiff

tell application “Finder”
activate
select file (converted_location as string)
end tell

return converted_location
