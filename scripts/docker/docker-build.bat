@echo off
setlocal enabledelayedexpansion

echo 🐳 Building Docker image with environment variables...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found! Please create one with your environment variables.
    exit /b 1
)

echo ✅ Loading environment variables from .env

REM Read environment variables from .env file
for /f "usebackq tokens=1,2 delims==" %%a in (.env) do (
    set "line=%%a"
    if not "!line:~0,1!"=="#" (
        set "%%a=%%b"
    )
)

echo 🔨 Building Docker image...

REM Build the Docker image with build args
docker build ^
    --build-arg DATABASE_URL="%DATABASE_URL%" ^
    --build-arg NEXTAUTH_SECRET="%NEXTAUTH_SECRET%" ^
    --build-arg NEXTAUTH_URL="%NEXTAUTH_URL%" ^
    --build-arg GOOGLE_CLIENT_ID="%GOOGLE_CLIENT_ID%" ^
    --build-arg GOOGLE_CLIENT_SECRET="%GOOGLE_CLIENT_SECRET%" ^
    --build-arg NEXT_PUBLIC_GA_ID="%NEXT_PUBLIC_GA_ID%" ^
    -t anime-card-manager:latest ^
    .

if %ERRORLEVEL% equ 0 (
    echo 🎉 Docker build completed successfully!
    echo 🚀 To run the container:
    echo    docker run -p 3000:3000 --env-file .env anime-card-manager:latest
) else (
    echo ❌ Docker build failed!
    exit /b 1
)