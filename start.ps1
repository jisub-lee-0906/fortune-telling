# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "-m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WorkingDirectory "backend" -NoNewWindow

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Set-Location "frontend"
npm run dev
