@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\start-dev.ps1"
