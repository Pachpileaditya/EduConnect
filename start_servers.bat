@echo off
echo Starting Teacher Student Platform servers...

echo.
echo Starting Backend Server...
cd backend\lms\lms
start "Backend Server" cmd /k "mvn spring-boot:run"

echo.
echo Starting Frontend Server...
cd ..\..\frontend\frontendapp
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this script...
pause > nul

