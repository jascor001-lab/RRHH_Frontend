@echo off
title RRHH Frontend - desarrollo (PWA activo como Carta Fianza)
echo.
echo ========================================
echo  Desarrollo HTTP (service worker ON)
echo ========================================
echo.
echo  URL:
echo    http://192.168.7.223:3004
echo    http://localhost:3004
echo.
echo  Para PWA igual que Carta Fianza:
echo    usa INICIAR-PWA.cmd (recomendado)
echo ========================================
echo.

cd /d "%~dp0"

if not exist "package.json" (
  echo ERROR: No se encontro package.json
  pause
  exit /b 1
)

if not exist "node_modules\next" (
  call npm install
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004 ^| findstr LISTENING') do (
  echo Liberando puerto 3004...
  taskkill /F /PID %%a >nul 2>&1
)

echo Iniciando...
echo.
call npm run dev
