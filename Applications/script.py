-- set local drive information
set playlistName to "Radio Show "
set path_to_AIFF_files to "Users:tim:Music:Convert to iTunes:"
set path_to_music_library to "Users:tim:Music:iTunes:iTunes Music:"
set path_to_recorded_file to "Users:tim:Music:Recorded Radio Programs:"


-- Set up today's date in format mm/dd/yyyy
set todaysDate to (current date)
set {m, d, y} to {month, day, year} of todaysDate
set monthList to {January, February, March, April, May, June, ¬
	July, August, September, October, November, December}
repeat with i from 1 to 12
	if m = (item i of monthList) then
		set monthString to text -2 thru -1 of ("0" & i)
		exit repeat
	end if
end repeat
set dayString to text -2 thru -1 of ("0" & d)
set todaysDate to monthString & "-" & dayString & "-" & y

-- set radio show's name with today's date
set theFileName to playlistName & " " & todaysDate & ".aif"

-- Let's get to work!
tell application "iTunes"
	activate
	-- set the volume in case of muting
	if (mute) then
		set mute to false
	end if
	set volume 5 -- so I know it's playing
	
	-- select playlist/radio stream
	set thePlaylist to playlist "Radio Programs"
	set shuffle of thePlaylist to false
	play track 1 of thePlaylist
end tell

-- Record the program
tell application "WireTap"
	activate
	start recording
end tell

-- Record for 3 hours (counted in seconds)
delay (1 * 10800)

-- Stop recording
tell application "WireTap"
	activate
	stop recording
	-- quit WireTap
	quit
end tell

tell application "iTunes"
	stop
end tell

-- Rename the newly recorded file with today's date
tell application "Finder"
	activate
	try
		set the_file_path to path_to_recorded_file & "show001.aiff:"
		set name of file the_file_path to theFileName
		
		-- move the file to the "Convert to iTunes" folder
		select file theFileName of folder path_to_recorded_file
		move selection to folder path_to_AIFF_files
	on error err
		display dialog err
	end try
	close front window
end tell

-- Add the file to iTunes and convert to AAC
tell application "iTunes"
	try
		if player state is stopped or player state is paused then
			set addedTrack to add theFileName
			
			-- convert to aac
			set newtrack to convert addedTrack -- newtrack will be the new AAC track 
			delete addedTrack
		else
			add theFileName
		end if
	on error err
		display dialog err
	end try
end tell
