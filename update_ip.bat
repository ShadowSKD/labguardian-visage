@echo off
setlocal enabledelayedexpansion

echo 🌐 Detecting physical IPv4 address...

set "IP="
set "ADAPTER="
set "EXCLUDE=WSL VMware VirtualBox Loopback Bluetooth"

:: Flag to identify when we're inside a valid adapter section
set "validAdapter=0"

:: Parse ipconfig line-by-line
for /f "delims=" %%L in ('ipconfig') do (
    set "line=%%L"

    rem Check for adapter name line
    echo !line! | findstr /R /C:"adapter " >nul
    if not errorlevel 1 (
        set "validAdapter=0"
        for %%A in (Ethernet "Wi-Fi" "Local Area Connection") do (
            echo !line! | findstr /I "%%~A" >nul
            if not errorlevel 1 (
                set "ADAPTER=!line:*adapter =!"
                set "ADAPTER=!ADAPTER::=!"
                set "validAdapter=1"
            )
        )

        rem Skip excluded adapter types
        for %%E in (%EXCLUDE%) do (
            echo !line! | findstr /I "%%E" >nul
            if not errorlevel 1 (
                set "validAdapter=0"
            )
        )
    )

    rem Inside a valid adapter section — look for IPv4
    if !validAdapter! == 1 (
        echo !line! | findstr /C:"IPv4 Address" >nul
        if not errorlevel 1 (
            for /f "tokens=2 delims=:" %%a in ("!line!") do (
                set "rawip=%%a"
                set "rawip=!rawip:~1!"
                set "IP=!rawip!"
                goto done
            )
        )
    )
)

:done

:: Fallback prompt if no IP detected
if "%IP%"=="" (
    echo ⚠️ Could not auto-detect IP from physical adapters.
    set /p IP=🔧 Please enter your local IP address manually: 
)

set "API_URL=http://%IP%:5000/api"
echo 📡 Using IP: %API_URL%

:: ---------- Update frontend\.env ----------
set "ENV_FILE=frontend\.env"
set "TEMP_FILE=frontend\.env.tmp"

> "%TEMP_FILE%" (
    for /f "usebackq delims=" %%i in ("%ENV_FILE%") do (
        echo %%i | findstr /B "VITE_API_URL=" >nul
        if errorlevel 1 (
            echo %%i
        )
    )
    echo VITE_API_URL=%API_URL%
)

move /Y "%TEMP_FILE%" "%ENV_FILE%" >nul

:: ---------- Update backend\.env ----------
set "BACKEND_ENV_FILE=backend\.env"
set "BACKEND_TEMP_FILE=backend\.env.tmp"

> "%BACKEND_TEMP_FILE%" (
    for /f "usebackq delims=" %%i in ("%BACKEND_ENV_FILE%") do (
        echo %%i | findstr /B "FRONTEND_URL=" >nul
        if errorlevel 1 (
            echo %%i
        )
    )
    echo FRONTEND_URL=http://%IP%:3000
)

move /Y "%BACKEND_TEMP_FILE%" "%BACKEND_ENV_FILE%" >nul

:: ---------- Update root .env ----------
set "ROOT_ENV_FILE=.env"
set "ROOT_TEMP_FILE=.env.tmp"

> "%ROOT_TEMP_FILE%" (
    for /f "usebackq delims=" %%i in ("%ROOT_ENV_FILE%") do (
        echo %%i | findstr /B "VITE_API_URL=" >nul
        if errorlevel 1 (
            echo %%i
        )
    )
    echo VITE_API_URL=%API_URL%
)

move /Y "%ROOT_TEMP_FILE%" "%ROOT_ENV_FILE%" >nul

echo ✅ Updated:
echo    - backend\.env (FRONTEND_URL)
echo    - frontend\.env (VITE_API_URL)
echo    - .env          (VITE_API_URL for Docker Compose)

exit /b 0
