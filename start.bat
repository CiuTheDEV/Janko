@echo off
title Janko Bot - Smart Controller

echo ========================================
echo        JANKO BOT - SYSTEM START 
echo ========================================

:: KROK 1: Synchronizacja bazy (opcjonalna)
echo.
set /p sync_db="Czy chcesz zsynchronizowac baze danych (prisma db push)? [t/n]: "
if /i "%sync_db%"=="t" (
    echo [DB] Synchronizacja bazy...
    call npm run db:push
    if %errorlevel% neq 0 (
        echo [ERROR] Blad synchronizacji bazy danych.
        pause
        exit /b %errorlevel%
    )
) else (
    echo [DB] Pomijanie synchronizacji bazy.
)

:: KROK 2: Rejestracja Komend
echo.
echo [STEP 2/3] Rejestrowanie slash commands...
call npm run deploy
if %errorlevel% neq 0 (
    echo [WARNING] Blad podczas rejestrowania komend! Bot moze nie miec aktualnych funkcji.
    choice /c tn /m "Czy mimo to chcesz uruchomic bota?"
    if errorlevel 2 exit /b %errorlevel%
)

:: KROK 3: Start Bota
echo.
echo [STEP 3/3] Uruchamianie bota...
echo ----------------------------------------
call npm run start
if %errorlevel% neq 0 (
    echo [ERROR] Bot zostal zatrzymany z bledem!
    pause
    exit /b %errorlevel%
)

pause
