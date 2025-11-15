; actions.ahk - safe actions for NeuroPilot Pro
; Usage: AutoHotkey actions.ahk <action> <optional_arg>
; Examples:
; AutoHotkey actions.ahk open_url https://youtube.com
SetTitleMatchMode, 2
action := %1%
arg := %2%

If (action = "open_url") {
  ; arg contains the URL
  Run, %arg%
} else if (action = "open_notepad") {
  Run, notepad.exe
} else if (action = "open_comet") {
  ; Replace with your Comet browser executable path if needed
  Run, "C:\Program Files\Comet\Comet.exe"
} else if (action = "screenshot") {
  Send, {PrintScreen}
} else {
  ; unknown
}
Return
