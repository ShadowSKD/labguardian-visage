@echo off
call update_ip.bat
if errorlevel 1 exit /b 1

echo 🚀 Starting Docker containers...
docker-compose up --build
