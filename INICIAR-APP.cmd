@echo off
title MoliRecursos APP (PWA produccion)
echo.
echo ========================================
echo  MoliRecursos - modo app / PWA
echo ========================================
echo.
echo  URL HTTP:
echo    http://192.168.7.223:4009
echo.
echo  PWA HTTPS:
echo    https://192.168.7.223:4443/login
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules\next" (
  call npm install
  if errorlevel 1 pause & exit /b 1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4009 :4443" ^| findstr LISTENING') do (
  taskkill /F /PID %%a >nul 2>&1
)

call npm run build
if errorlevel 1 pause & exit /b 1
call npm run start:pwa
