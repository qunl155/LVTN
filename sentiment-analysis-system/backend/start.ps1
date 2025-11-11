# Script khởi động Backend FastAPI
# Chạy: .\start.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Kiểm tra virtual environment (workspace root)
if (Test-Path "../../.venv/Scripts/python.exe") {
    Write-Host "[OK] Using workspace venv" -ForegroundColor Green
    $pythonExe = "../../.venv/Scripts/python.exe"
} elseif (Test-Path "D:/LVTN/New folder/.venv/Scripts/python.exe") {
    Write-Host "[OK] Using workspace venv (absolute path)" -ForegroundColor Green
    $pythonExe = "D:/LVTN/New folder/.venv/Scripts/python.exe"
} else {
    Write-Host "[ERROR] Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please create venv at workspace root:" -ForegroundColor Yellow
    Write-Host "  cd 'D:/LVTN/New folder'" -ForegroundColor Yellow
    Write-Host "  python -m venv .venv" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra file .env
if (-not (Test-Path ".\.env")) {
    Write-Host "[WARNING] .env file not found, using .env.example" -ForegroundColor Yellow
    Copy-Item ".\.env.example" ".\.env"
}

# Khởi động server
Write-Host ""
Write-Host "Starting uvicorn server..." -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Health Check: http://localhost:8000/api/v1/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
Write-Host ""

& $pythonExe -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
