#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#SingleInstance, force ;
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

F8:: 
{
    MouseGetPos, xpos, ypos 
    MsgBox, The cursor is at X%xpos% Y%ypos%.
    return
}

F7::
{
    Loop
    {
        MouseMove, 288, 150 ; at next video right arrow
        Click ; click to highlight video input field
        check_cursor()
        MouseMove, 1002, 149 ; at the video input field arrow
        Click ; click to highlight video input field
        Sleep, 40 ; wait for highlight of text field
        SendInput, ^c ; copy video name
        ClipWait  ; Wait for the clipboard to contain text.
        MouseMove, 938, 182 ; at the drop down menu
        Click ; open the drop down menu
        Sleep, 40 ; loading down arrow menu
        MouseMove, 937, 247 ; at 'export'
        Click ; click 'export'
        check_cursor()
        SendInput, ^v ; paste in video name
        Sleep, 1000
        SendInput, { Enter }
        Sleep, 500 ; wait for export to finish
        if WinExist("Confirm Save As")
        {
            MsgBox, Encountered a duplicate -> stopping script. This occurs when bookmarks are named the same and the position in pinball browser gets out of order. You'll have to manually browse back to where you left off and continue the script.
            break
        }
    }
    return
}

check_cursor()
{
    MouseMove, 366, 186
    Loop 
    { 
        Sleep, 450
        If A_Cursor not contains AppStarting,Wait
        {
            Sleep, 250
            If A_Cursor not contains AppStarting,Wait
                break
        }
    }

    return
}