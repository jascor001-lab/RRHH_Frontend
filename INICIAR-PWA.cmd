@echo off
title MoliRecursos PWA :3443
echo.
echo ========================================
echo  MoliRecursos PWA (puerto 3443)
echo ========================================
echo.
echo  Para instalar / abrir como aplicacion:
echo.
echo    https://192.168.7.223:3443/login
echo.
echo  Si Chrome avisa el certificado:
echo    Avanzado -^> Continuar / Prosseguir
echo  Luego aparece Instalar aplicacion.
echo.
echo  Uso diario sin certificado (HTTP):
echo    http://192.168.7.223:3005
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules\next" (
  call npm install
  if errorlevel 1 pause & exit /b 1
)

if not exist "certs\lan.pem" (
  echo Generando certificado para 192.168.7.223 ...
  if not exist "certs" mkdir certs
  mkcert -cert-file certs\lan.pem -key-file certs\lan-key.pem 192.168.7.223 localhost 127.0.0.1 ::1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3005 :3443" ^| findstr LISTENING') do (
  taskkill /F /PID %%a >nul 2>&1
)

echo Compilando...
call npm run build
if errorlevel 1 (
  echo ERROR al compilar.
  pause
  exit /b 1
)

echo.
echo Iniciando... PWA en https://192.168.7.223:3443
echo.
call npm run start:pwa
