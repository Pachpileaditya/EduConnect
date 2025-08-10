Write-Host "Starting Teacher Student Platform servers..." -ForegroundColor Green

Write-Host "`nStarting Backend Server..." -ForegroundColor Yellow
Set-Location "backend\lms\lms"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

Write-Host "`nStarting Frontend Server..." -ForegroundColor Yellow
Set-Location "..\..\frontend\frontendapp"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`nBoth servers are starting..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

