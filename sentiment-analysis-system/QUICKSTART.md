# 🚀 Quick Start Guide

## Khởi Chạy Nhanh (Windows)

### Bước 1: Cài Đặt Yêu Cầu

1. **Python 3.11+**
   - Download: https://www.python.org/downloads/
   - Chọn "Add Python to PATH" khi cài đặt

2. **Node.js 18+**
   - Download: https://nodejs.org/
   - Chọn phiên bản LTS

3. **MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Hoặc sử dụng MongoDB Atlas (cloud)

### Bước 2: Cài Đặt Backend

```powershell
# Mở PowerShell trong thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
.\venv\Scripts\Activate.ps1

# Nếu gặp lỗi execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env
Copy-Item .env.example .env

# Chỉnh sửa .env với thông tin của bạn
notepad .env
```

### Bước 3: Cài Đặt Frontend

```powershell
# Mở PowerShell mới trong thư mục frontend
cd frontend

# Cài đặt dependencies
npm install
```

### Bước 4: Khởi Động MongoDB

**Option 1: MongoDB Local**
```powershell
# Khởi động MongoDB service
net start MongoDB

# Kiểm tra MongoDB đang chạy
mongosh
```

**Option 2: MongoDB Atlas**
- Đăng ký tài khoản tại https://www.mongodb.com/cloud/atlas
- Tạo cluster miễn phí
- Lấy connection string và cập nhật vào `.env`

### Bước 5: Chạy Backend

```powershell
# Trong thư mục backend (với venv đã activate)
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Kiểm tra: http://localhost:8000/docs

### Bước 6: Chạy Frontend

```powershell
# Mở PowerShell mới trong thư mục frontend
cd frontend
npm start
```

Tự động mở: http://localhost:3000

---

## ✅ Checklist Khởi Động

- [ ] Python 3.11+ đã cài đặt
- [ ] Node.js 18+ đã cài đặt
- [ ] MongoDB đang chạy
- [ ] Backend dependencies đã cài (`pip install -r requirements.txt`)
- [ ] Frontend dependencies đã cài (`npm install`)
- [ ] File `.env` đã được cấu hình
- [ ] Backend đang chạy ở port 8000
- [ ] Frontend đang chạy ở port 3000

---

## 🐛 Xử Lý Lỗi Thường Gặp

### 1. Lỗi: "execution policy" khi activate venv
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Lỗi: "MongoDB service not found"
- Cài đặt MongoDB từ: https://www.mongodb.com/try/download/community
- Hoặc sử dụng MongoDB Atlas

### 3. Lỗi: "Port 8000 already in use"
```powershell
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000

# Kill process (thay PID)
taskkill /PID <PID> /F
```

### 4. Lỗi: "Port 3000 already in use"
```powershell
# Frontend sẽ tự động đề xuất port khác (3001)
# Hoặc kill process:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### 5. Lỗi: "Module not found"
```powershell
# Backend
pip install -r requirements.txt --upgrade

# Frontend
npm install
```

### 6. Lỗi kết nối Backend-Frontend
- Kiểm tra `REACT_APP_API_URL` trong frontend/.env
- Đảm bảo backend đang chạy ở đúng port
- Kiểm tra CORS settings trong backend

---

## 📝 Test Nhanh

### Test Backend
```powershell
# Kiểm tra health endpoint
curl http://localhost:8000/api/v1/health

# Hoặc mở browser
http://localhost:8000/docs
```

### Test Phân Tích
1. Mở http://localhost:3000
2. Nhập bài test:
```
Video này rất hay và bổ ích
Nội dung tệ quá
Bình thường thôi
```
3. Click "Phân Tích Cảm Xúc"
4. Xem kết quả

---

## 🎯 Thêm Model AI

Nếu bạn có model AI của riêng:

1. Đặt file model vào: `backend/ml_model/sentiment_model.pkl`

2. Format model:
```python
# Option 1: Chỉ model
joblib.dump(model, 'sentiment_model.pkl')

# Option 2: Model + Vectorizer
joblib.dump({
    'model': model,
    'vectorizer': vectorizer
}, 'sentiment_model.pkl')
```

3. Cập nhật path trong `.env`:
```
SENTIMENT_MODEL_PATH=./ml_model/sentiment_model.pkl
```

**Nếu không có model:** Hệ thống sẽ dùng rule-based analysis.

---

## 🐳 Chạy Bằng Docker (Dễ Nhất)

Nếu đã cài Docker Desktop:

```powershell
# Trong thư mục gốc
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

Truy cập:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- MongoDB: localhost:27017

---

## 💡 Tips

1. **Dùng YouTube API**:
   - Lấy API key: https://console.cloud.google.com/
   - Enable YouTube Data API v3
   - Thêm vào `.env`: `YOUTUBE_API_KEY=your_key`

2. **Tăng Performance**:
   - Cài thêm Redis để cache
   - Dùng MongoDB Atlas để database scale

3. **Development**:
   - Backend có `--reload` để auto-reload khi code thay đổi
   - Frontend có hot-reload tự động

---

## 📞 Cần Giúp Đỡ?

1. Xem README.md chi tiết
2. Kiểm tra API docs: http://localhost:8000/docs
3. Xem logs của backend và frontend
4. Kiểm tra MongoDB đang chạy

**Chúc may mắn! 🚀**
