# Sentiment Analysis System

This project is a sentiment analysis system that utilizes FastAPI for the backend, React.js for the frontend, and MongoDB for data storage. The system leverages an existing AI model to analyze sentiments from social media comments.

## Project Structure

# 🔍 Hệ Thống Phân Tích Cảm Xúc Mạng Xã Hội

Hệ thống phân tích cảm xúc người dùng trên mạng xã hội dựa trên bình luận và tương tác. Phân loại cảm xúc "Tích cực", "Tiêu cực", "Trung tính" và phát hiện nội dung nhạy cảm (bạo lực, chính trị) để đưa ra cảnh báo và đề xuất cho người dùng.

## 🎯 Tính Năng Chính

- ✅ **Phân tích cảm xúc**: Phân loại bình luận thành Tích cực, Tiêu cực, Trung tính
- 🚨 **Phát hiện nội dung nhạy cảm**: Cảnh báo nội dung bạo lực, chính trị
- 📊 **Biểu đồ trực quan**: Hiển thị thống kê và biểu đồ phân tích
- 🔗 **Phân tích từ URL**: Lấy bình luận từ YouTube, Facebook (đang phát triển)
- 💡 **Đề xuất thông minh**: Gợi ý người dùng nên xem nội dung hay không
- 📝 **Lịch sử phân tích**: Lưu trữ và xem lại các phân tích trước đó
- 🎯 **Độ tin cậy cao**: Hiển thị mức độ tin cậy của mỗi phân tích

## 🏗️ Cấu Trúc Dự Án

```
sentiment-analysis-system/
├── backend/                    # FastAPI Backend
│   ├── src/
│   │   ├── main.py            # Entry point
│   │   ├── api/               # API routes
│   │   │   ├── routes.py      # Endpoints
│   │   │   └── dependencies.py
│   │   ├── models/            # Data models
│   │   │   ├── sentiment.py
│   │   │   └── social_media.py
│   │   ├── services/          # Business logic
│   │   │   ├── sentiment_analyzer.py
│   │   │   └── data_processor.py
│   │   ├── database/          # Database layer
│   │   │   └── mongodb.py
│   │   └── config/            # Configuration
│   │       └── settings.py
│   ├── ml_model/              # AI Model
│   │   └── sentiment_model.pkl
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DataInput.jsx
│   │   │   └── SentimentChart.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   │       └── App.css
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống

- Python 3.11+
- Node.js 18+
- MongoDB 7.0+
- Docker & Docker Compose (tùy chọn)

### Phương Án 1: Chạy Bằng Docker (Khuyến nghị)

```bash
# Clone repository
git clone <repository-url>
cd sentiment-analysis-system

# Chạy toàn bộ hệ thống
docker-compose up -d

# Xem logs
docker-compose logs -f
```

**Truy cập:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- MongoDB: localhost:27017

### Phương Án 2: Chạy Thủ Công

#### Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Tạo file .env từ .env.example
cp .env.example .env

# Chỉnh sửa file .env với cấu hình của bạn
# Ví dụ:
# MONGODB_URI=mongodb://localhost:27017
# DATABASE_NAME=sentiment_analysis_db
# SENTIMENT_MODEL_PATH=./ml_model/sentiment_model.pkl

# Chạy server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
# Mở terminal mới
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

#### MongoDB

```bash
# Khởi động MongoDB
# Windows (nếu cài từ installer):
net start MongoDB

# Mac (với Homebrew):
brew services start mongodb-community

# Linux (systemd):
sudo systemctl start mongod
```

## 📖 Hướng Dẫn Sử Dụng

### 1. Phân Tích Từ Bình Luận Thủ Công

1. Truy cập http://localhost:3000
2. Chọn tab "📝 Nhập Bình Luận"
3. Nhập các bình luận, mỗi dòng một bình luận
4. Click "🔍 Phân Tích Cảm Xúc"
5. Xem kết quả phân tích, biểu đồ và đề xuất

### 2. Phân Tích Từ URL

1. Chọn tab "🔗 Phân Tích Từ URL"
2. Nhập URL YouTube (ví dụ: https://www.youtube.com/watch?v=xxx)
3. Click "🔍 Phân Tích Từ URL"
4. Hệ thống sẽ tự động lấy bình luận và phân tích

**Lưu ý:** Để sử dụng tính năng phân tích từ YouTube URL, bạn cần:
- Có YouTube API Key
- Cấu hình trong file `.env`: `YOUTUBE_API_KEY=your_api_key`

### 3. Đọc Kết Quả

#### Cảm Xúc Tổng Thể
- 😊 **Tích Cực**: Phần lớn bình luận tích cực
- 😟 **Tiêu Cực**: Phần lớn bình luận tiêu cực  
- 😐 **Trung Tính**: Bình luận trung lập

#### Thống Kê
- Tổng số bình luận
- Số lượng và phần trăm mỗi loại cảm xúc
- Độ tin cậy trung bình

#### Cảnh Báo Nội Dung
- 🚫 **Bạo lực**: Phát hiện từ ngữ bạo lực
- ⚖️ **Chính trị**: Phát hiện nội dung chính trị

#### Đề Xuất
- ✅ **NÊN XEM**: Nội dung tích cực
- ⚠️ **CÂN NHẮC**: Nội dung có vấn đề
- 🚫 **KHÔNG NÊN XEM**: Nội dung tiêu cực/nguy hiểm

## 🔧 Cấu Hình

### Backend (.env)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=sentiment_analysis_db

# Model
SENTIMENT_MODEL_PATH=./ml_model/sentiment_model.pkl

# CORS
ALLOW_ORIGINS=http://localhost:3000,http://localhost:3001

# YouTube API (tùy chọn)
YOUTUBE_API_KEY=your_youtube_api_key

# Analysis
MAX_COMMENTS_PER_REQUEST=1000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000
```

## 📚 API Documentation

Sau khi chạy backend, truy cập:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Các Endpoint Chính

#### POST `/api/v1/analyze`
Phân tích danh sách bình luận

**Request:**
```json
{
  "comments": ["Bình luận 1", "Bình luận 2"],
  "source_url": "https://youtube.com/...",
  "source_platform": "youtube"
}
```

**Response:**
```json
{
  "analysis_id": "uuid",
  "comments_analysis": [...],
  "statistics": {...},
  "overall_sentiment": "positive",
  "content_warning": {...},
  "recommendation": "..."
}
```

#### POST `/api/v1/analyze-url`
Phân tích từ URL

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=xxx",
  "max_comments": 100
}
```

#### GET `/api/v1/history`
Lấy lịch sử phân tích

#### GET `/api/v1/health`
Kiểm tra trạng thái hệ thống

## 🤖 Model AI

Hệ thống hỗ trợ model AI được huấn luyện sẵn. Đặt file model vào:
```
backend/ml_model/sentiment_model.pkl
```

**Format model yêu cầu:**
- Pickle file (.pkl) chứa model scikit-learn
- Hoặc dictionary: `{'model': model_obj, 'vectorizer': vectorizer_obj}`

**Nếu không có model:**
Hệ thống sẽ tự động sử dụng phương pháp rule-based để phân tích.

## 🛠️ Phát Triển

### Thêm Platform Mới

1. Cập nhật `DataProcessor.detect_platform()` trong `data_processor.py`
2. Tạo Fetcher class mới (tương tự `YouTubeDataFetcher`)
3. Cập nhật logic trong `routes.py`

### Thêm Keywords Phát Hiện

Chỉnh sửa trong `backend/src/config/settings.py`:

```python
VIOLENCE_KEYWORDS = ["bạo lực", "đánh", ...]
POLITICAL_KEYWORDS = ["chính trị", "đảng", ...]
```

### Test

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi kết nối MongoDB
```bash
# Kiểm tra MongoDB đang chạy
# Windows:
net start MongoDB

# Kiểm tra port
netstat -an | findstr :27017
```

### Lỗi import pydantic_settings
```bash
pip install pydantic-settings
```

### Lỗi CORS
Thêm origin vào `ALLOW_ORIGINS` trong `.env` của backend

### Frontend không connect được Backend
Kiểm tra `REACT_APP_API_URL` trong frontend `.env`

## 📊 Screenshots

*(Thêm screenshots của ứng dụng)*

## 🤝 Đóng Góp

Contributions are welcome! Please:
1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Tác Giả

- **LVTN Project** - *Initial work*

## 🙏 Acknowledgments

- FastAPI - Modern web framework
- React - UI library
- MongoDB - Database
- Chart.js - Charting library
- scikit-learn - Machine learning

---

**Lưu ý:** Đây là dự án LVTN (Luận văn tốt nghiệp). Vui lòng tuân thủ các quy định về bản quyền và sử dụng có trách nhiệm.

## Features

- **Sentiment Analysis**: Analyze sentiments (positive, negative, neutral) from social media comments using a pre-trained AI model.
- **Data Visualization**: Visualize sentiment data through charts in the frontend.
- **User Input**: Allow users to input data for analysis through a user-friendly interface.
- **API Integration**: Seamless communication between the frontend and backend via RESTful APIs.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sentiment-analysis-system
   ```

2. Set up the backend:
   - Navigate to the `backend` directory.
   - Install the required Python packages:
     ```
     pip install -r requirements.txt
     ```

3. Set up the frontend:
   - Navigate to the `frontend` directory.
   - Install the required npm packages:
     ```
     npm install
     ```

### Running the Application

1. Start the MongoDB service.
2. Run the backend:
   ```
   cd backend/src
   uvicorn main:app --reload
   ```
3. Run the frontend:
   ```
   cd frontend
   npm start
   ```

### Usage

- Access the frontend application at `http://localhost:3000`.
- Use the input form to submit social media comments for sentiment analysis.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.