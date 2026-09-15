@echo off
title RRHH Frontend - HTTP :4009
echo.
echo ========================================
echo  Acceso normal (sin certificado)
echo ========================================
echo.
echo  URL:
echo    http://192.168.7.223:4009
echo    http://localhost:4009
echo.
echo  Backend auth: puerto 4008
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

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4009 ^| findstr LISTENING') do (
  echo Liberando puerto 4009...
  taskkill /F /PID %%a >nul 2>&1
)

echo Iniciando...
echo.
call npm run dev
