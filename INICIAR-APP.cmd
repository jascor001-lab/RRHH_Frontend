@echo off
title MoliRecursos APP (PWA produccion)
echo.
echo ========================================
echo  MoliRecursos - modo app / PWA
echo  Igual que Carta Fianza (HTTP)
echo ========================================
echo.
echo  URL:
echo    http://192.168.7.223:3004
echo.
echo  Android:
echo    Chrome -^> ⋮ -^> Agregar a pantalla de inicio
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules\next" (
  call npm install
  if errorlevel 1 pause & exit /b 1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004 ^| findstr LISTENING') do (
  taskkill /F /PID %%a >nul 2>&1
)

call npm run start:pwa
