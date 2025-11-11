@echo off
REM Script khởi động Backend FastAPI
REM Chạy: start.bat

echo ==================================
echo   Starting Backend Server...
echo ==================================

REM Kiểm tra virtual environment (workspace root)
if exist "..\..\\.venv\Scripts\python.exe" (
    echo [OK] Using workspace venv
    set PYTHON_EXE=..\..\\.venv\Scripts\python.exe
) else if exist "D:\LVTN\New folder\.venv\Scripts\python.exe" (
    echo [OK] Using workspace venv (absolute path)
    set PYTHON_EXE=D:\LVTN\New folder\.venv\Scripts\python.exe
) else (
    echo [ERROR] Virtual environment not found!
    echo Please create venv at workspace root:
    echo   cd "D:\LVTN\New folder"
    echo   python -m venv .venv
    pause
    exit /b 1
)

REM Kiểm tra file .env
if not exist ".\.env" (
    echo [WARNING] .env file not found, using .env.example
    copy ".\.env.example" ".\.env"
)

REM Khởi động server
echo.
echo Starting uvicorn server...
echo API Docs: http://localhost:8000/docs
echo Health Check: http://localhost:8000/api/v1/health
echo.
echo Press Ctrl+C to stop server
echo.

%PYTHON_EXE% -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
