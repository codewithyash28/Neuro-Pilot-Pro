@echo off
REM start_local.bat - starts the local bridge
REM Requires Python 3 installed and AutoHotkey installed and in PATH
echo Starting NeuroPilot Pro local bridge...
python "%~dp0local_server.py"
pause
