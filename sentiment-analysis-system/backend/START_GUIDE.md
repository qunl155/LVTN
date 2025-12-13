# 🚀 Quick Start - Backend

## Cách 1: Dùng Script (Đơn giản nhất)

### PowerShell:
```powershell
cd backend
.\start.ps1
```

### CMD:
```cmd
cd backend
start.bat
```

---

## Cách 2: Chạy Thủ Công

### Bước 1: Kích hoạt virtual environment

**PowerShell:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1

# Nếu lỗi execution policy:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**CMD:**
```cmd
cd backend
venv\Scripts\activate.bat
```

### Bước 2: Chạy server
```bash
# Sau khi activate venv, prompt sẽ có (venv)
(venv) PS> uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Cách 3: Dùng Python Path Trực Tiếp

**PowerShell:**
```powershell
cd backend
& "D:/LVTN/New folder/.venv/Scripts/python.exe" -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**CMD:**
```cmd
cd backend
"D:\LVTN\New folder\.venv\Scripts\python.exe" -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

---

##  Tại sao phải dùng đường dẫn đầy đủ?

### Vấn đề:
Khi bạn chạy `python` hoặc `uvicorn` trong terminal, Windows tìm trong:
1. Current directory
2. System PATH environment variable

Nhưng Python trong **venv không tự động vào PATH** khi bạn chưa activate.

### Giải pháp:

**Option 1:** Activate venv trước
```powershell
.\venv\Scripts\Activate.ps1
uvicorn src.main:app --reload  # ← Giờ dùng được
```

**Option 2:** Chỉ định đường dẫn đầy đủ
```powershell
# Không cần activate, chạy trực tiếp
"D:/LVTN/New folder/.venv/Scripts/python.exe" -m uvicorn src.main:app --reload
```

**Option 3:** Dùng script (đã tự động)
```powershell
.\start.ps1  # ← Script tự tìm Python trong venv
```

---

## 🔍 Kiểm tra Backend đang chạy:

### 1. API Documentation
http://localhost:8000/docs

### 2. Health Check
http://localhost:8000/api/v1/health

### 3. Root Endpoint
http://localhost:8000/

---

##  Dừng Server

Nhấn `Ctrl + C` trong terminal

---

##  Troubleshooting

### Lỗi: "uvicorn not found"
**Nguyên nhân:** Chưa activate venv hoặc chưa cài uvicorn

**Giải pháp:**
```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# Cài lại dependencies
pip install -r requirements.txt
```

### Lỗi: "Port 8000 already in use"
**Nguyên nhân:** Server đang chạy ở terminal khác

**Giải pháp:**
```powershell
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay <PID>)
taskkill /PID <PID> /F

# Hoặc dùng port khác
uvicorn src.main:app --reload --port 8001
```

### Lỗi: "Module not found"
**Nguyên nhân:** Dependencies chưa được cài

**Giải pháp:**
```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# Cài dependencies
pip install -r requirements.txt
```

### Lỗi: "Cannot connect to MongoDB"
**Nguyên nhân:** MongoDB chưa chạy

**Giải pháp:**
```powershell
# Windows
net start MongoDB

# Hoặc kiểm tra MongoDB đang chạy
services.msc  # Tìm MongoDB
```

---

## Tips

1. **Luôn dùng script** `start.ps1` hoặc `start.bat` cho đơn giản
2. **Giữ terminal mở** - server cần terminal chạy liên tục
3. **Xem logs** - Mọi request sẽ hiện trong terminal
4. **Auto-reload** - Code thay đổi → server tự động restart

---

##  Next Steps

Sau khi backend chạy:
1. Test API tại http://localhost:8000/docs
2. Chạy frontend: `cd frontend && npm start`
3. Truy cập app: http://localhost:3000
