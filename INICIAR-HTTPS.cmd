@echo off
title RRHH HTTPS
echo.
echo Link PWA: https://192.168.7.223:4443/login
echo HTTP:     http://192.168.7.223:4009
echo.
cd /d "%~dp0"
call npm run start:https
