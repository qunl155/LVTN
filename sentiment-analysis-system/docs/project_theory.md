# 📖 LÝ THUYẾT HỆ THỐNG PHÂN TÍCH CẢM XÚC

> Tài liệu này giải thích lý thuyết **trực tiếp liên quan đến project** của bạn.

---

## 📁 CẤU TRÚC PROJECT

```
backend/
├── src/
│   ├── services/
│   │   ├── sentiment_analyzer.py   ← Phân tích cảm xúc (MÔ HÌNH CHÍNH)
│   │   └── data_processor.py       ← Xử lý dữ liệu đầu vào
│   ├── models/
│   │   └── sentiment.py            ← Định nghĩa các model dữ liệu
│   └── config/
│       └── settings.py             ← Cấu hình hệ thống
└── ml_model/
    └── phobert_tuned_model/        ← Model PhoBERT đã fine-tune
```

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1 Luồng xử lý trong project

```
┌──────────────────────────────────────────────────────────────────────┐
│                         LUỒNG XỬ LÝ CHÍNH                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [User nhập bình luận]                                               │
│          │                                                           │
│          ▼                                                           │
│  ┌────────────────────────────────────────────────┐                 │
│  │  data_processor.py                              │                 │
│  │  • Làm sạch văn bản                             │                 │
│  │  • Xử lý URL, ký tự đặc biệt                    │                 │
│  └──────────────────────┬─────────────────────────┘                 │
│                         │                                            │
│                         ▼                                            │
│  ┌────────────────────────────────────────────────┐                 │
│  │  sentiment_analyzer.py                          │                 │
│  │  • Tiền xử lý thêm                              │                 │
│  │  • Tokenization (BPE)                           │                 │
│  │  • Đưa qua PhoBERT                              │                 │
│  │  • Softmax → Xác suất                           │                 │
│  │  • Phát hiện nội dung nhạy cảm                  │                 │
│  └──────────────────────┬─────────────────────────┘                 │
│                         │                                            │
│                         ▼                                            │
│  ┌────────────────────────────────────────────────┐                 │
│  │  OUTPUT                                         │                 │
│  │  • Nhãn: POSITIVE / NEUTRAL / NEGATIVE          │                 │
│  │  • Độ tin cậy: 0% - 100%                        │                 │
│  │  • Cảnh báo nội dung (nếu có)                   │                 │
│  └────────────────────────────────────────────────┘                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Các file chính và chức năng

| File | Chức năng | Hàm quan trọng |
|:-----|:----------|:---------------|
| [sentiment_analyzer.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/services/sentiment_analyzer.py) | Phân tích cảm xúc | `predict_sentiment_ml()` |
| [data_processor.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/services/data_processor.py) | Xử lý dữ liệu | `clean_text()` |
| [sentiment.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/models/sentiment.py) | Định nghĩa models | `SentimentLabel`, `CommentAnalysis` |
| [settings.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/config/settings.py) | Cấu hình | `VIOLENCE_KEYWORDS`, `POLITICAL_KEYWORDS` |

---

## 2. PHÂN LOẠI CẢM XÚC (sentiment.py)

### 2.1 Định nghĩa nhãn cảm xúc

```python
# File: backend/src/models/sentiment.py (dòng 6-10)

class SentimentLabel(str, Enum):
    POSITIVE = "positive"  # Tích cực
    NEGATIVE = "negative"  # Tiêu cực
    NEUTRAL = "neutral"    # Trung tính
```

**Lý thuyết phân loại cảm xúc:**

| Nhãn | Index | Mô tả | Ví dụ |
|:-----|:-----:|:------|:------|
| POSITIVE | 0 | Bình luận tích cực, khen ngợi | "Sản phẩm tốt quá!" |
| NEUTRAL | 1 | Bình luận trung lập, mô tả | "Sản phẩm màu đen" |
| NEGATIVE | 2 | Bình luận tiêu cực, phàn nàn | "Sản phẩm tệ quá" |

### 2.2 Định nghĩa loại nội dung

```python
# File: backend/src/models/sentiment.py (dòng 12-17)

class ContentType(str, Enum):
    NORMAL = "normal"
    POLITICAL = "political"  # Chính trị
    VIOLENCE = "violence"    # Bạo lực
    SPAM = "spam"
```

**Lý thuyết phát hiện nội dung nhạy cảm:**
- Sử dụng phương pháp **keyword matching** (so khớp từ khóa)
- Danh sách từ khóa được định nghĩa trong `settings.py`
- Phát hiện nhanh, không cần model AI

---

## 3. XỬ LÝ DỮ LIỆU (data_processor.py)

### 3.1 Làm sạch văn bản

```python
# File: backend/src/services/data_processor.py (dòng 13-32)

class DataProcessor:
    @staticmethod
    def clean_text(text: str) -> str:
        # Bước 1: Chuyển chữ thường
        text = text.lower()
        
        # Bước 2: Xóa URL
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        
        # Bước 3: Xóa @ và #
        text = re.sub(r'@', '', text)
        text = re.sub(r'#', '', text)
        
        # Bước 4: Xóa khoảng trắng thừa
        text = ' '.join(text.split())
        
        return text.strip()
```

**Lý thuyết tiền xử lý văn bản:**

| Bước | Lý do | Regular Expression |
|:-----|:------|:-------------------|
| Chữ thường | "TỐT" = "tốt" = "Tốt" | `text.lower()` |
| Xóa URL | URL không mang cảm xúc | `http\S+\|www\S+` |
| Xóa mention | @username không quan trọng | `@` |
| Xóa hashtag | #hashtag giữ nội dung | `#` |
| Chuẩn hóa khoảng trắng | Đồng nhất định dạng | `' '.join(text.split())` |

### 3.2 Ví dụ xử lý

```
INPUT:  "SẢN PHẨM RẤT TỐT!!! 👍 https://shop.com @seller #review"
         │
         ▼ lower()
        "sản phẩm rất tốt!!! 👍 https://shop.com @seller #review"
         │
         ▼ Xóa URL
        "sản phẩm rất tốt!!! 👍  @seller #review"
         │
         ▼ Xóa @ và #
        "sản phẩm rất tốt!!! 👍  seller review"
         │
         ▼ Chuẩn hóa
OUTPUT: "sản phẩm rất tốt!!! 👍 seller review"
```

---

## 4. PHÂN TÍCH CẢM XÚC (sentiment_analyzer.py)

### 4.1 Khởi tạo model

```python
# File: backend/src/services/sentiment_analyzer.py (dòng 14-25)

class SentimentAnalyzer:
    def __init__(self, model_path: str = None):
        self.model_path = model_path or settings.SENTIMENT_MODEL_PATH
        self.model = None
        self.vectorizer = None  # Tokenizer
        self.load_model()
```

**Lý thuyết:**
- `model_path` = Đường dẫn đến thư mục chứa PhoBERT
- `model` = Mô hình PhoBERT đã được load
- `vectorizer` = Tokenizer để tách từ

### 4.2 Load model PhoBERT

```python
# File: backend/src/services/sentiment_analyzer.py (dòng 27-49)

def load_model(self):
    # Load PhoBERT model
    self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path)
    self.vectorizer = AutoTokenizer.from_pretrained(self.model_path)
```

**Lý thuyết:**
- `AutoModelForSequenceClassification`: Model BERT có thêm lớp phân loại
- `AutoTokenizer`: Bộ tokenizer tự động nhận dạng loại model

### 4.3 Tiền xử lý bổ sung

```python
# File: backend/src/services/sentiment_analyzer.py (dòng 99-109)

def preprocess_text(self, text: str) -> str:
    # Chuyển chữ thường
    text = text.lower()
    
    # Xóa URL
    text = re.sub(r'http\S+|www.\S+', '', text)
    
    # Xóa ký tự đặc biệt nhưng GIỮ TIẾNG VIỆT
    text = re.sub(r'[^\w\s...ký tự tiếng Việt...]', '', text)
    
    # Xóa khoảng trắng thừa
    text = ' '.join(text.split())
    
    return text
```

**Lý thuyết:**
- Giữ lại 29 ký tự có dấu tiếng Việt: `àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ`
- Quan trọng vì tiếng Việt phụ thuộc nhiều vào dấu

---

## 5. DỰ ĐOÁN CẢM XÚC (Hàm chính)

### 5.1 Code và giải thích

```python
# File: backend/src/services/sentiment_analyzer.py (dòng 130-183)

def predict_sentiment_ml(self, text: str) -> Tuple[SentimentLabel, float]:
    # BƯỚC 1: Tiền xử lý
    processed_text = self.preprocess_text(text)
    
    # BƯỚC 2: Tokenization
    inputs = self.vectorizer(
        processed_text,
        return_tensors="pt",    # Trả về PyTorch tensor
        truncation=True,        # Cắt nếu quá dài
        padding=True,           # Thêm padding nếu cần
        max_length=256          # Tối đa 256 tokens
    )
    
    # BƯỚC 3: Dự đoán
    with torch.no_grad():                    # Không tính gradient (inference)
        outputs = self.model(**inputs)       # Forward pass
        logits = outputs.logits              # Điểm thô [z_pos, z_neu, z_neg]
        probabilities = torch.softmax(logits, dim=1)[0]  # Chuyển thành xác suất
        prediction = torch.argmax(probabilities).item()  # Lấy index cao nhất
        confidence = float(probabilities[prediction])    # Lấy xác suất
    
    # BƯỚC 4: Map kết quả
    sentiment_map = {
        0: SentimentLabel.POSITIVE,
        1: SentimentLabel.NEUTRAL,
        2: SentimentLabel.NEGATIVE,
    }
    
    return sentiment_map[prediction], confidence
```

### 5.2 Giải thích từng bước

```
BƯỚC 1: TIỀN XỬ LÝ
──────────────────
Input:  "SẢN PHẨM RẤT TỐT!!!"
Output: "sản phẩm rất tốt"


BƯỚC 2: TOKENIZATION
────────────────────
Input:  "sản phẩm rất tốt"
Output: {
    'input_ids': [[0, 1234, 5678, 9012, 3456, 2]],
    'attention_mask': [[1, 1, 1, 1, 1, 1]]
}

Giải thích:
• input_ids: Mã số của các token
  - 0 = <s> (bắt đầu câu)
  - 1234, 5678, 9012, 3456 = các từ
  - 2 = </s> (kết thúc câu)
• attention_mask: 1 = token thật, 0 = padding


BƯỚC 3: DỰ ĐOÁN QUA PHOBERT
───────────────────────────

                    Token IDs
                        │
                        ▼
            ┌───────────────────────┐
            │      EMBEDDING        │
            │  (tra cứu vector)     │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   12 TRANSFORMER      │
            │      LAYERS           │
            │  (Self-Attention +    │
            │   Feed-Forward)       │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   CLASSIFICATION      │
            │      LAYER            │
            │  768 → 3 outputs      │
            └───────────┬───────────┘
                        │
                        ▼
                    logits
                [2.5, 0.3, -1.2]


BƯỚC 4: SOFTMAX
───────────────
logits = [2.5, 0.3, -1.2]
          ↓
exp(logits) = [12.18, 1.35, 0.30]
          ↓
sum = 13.83
          ↓
probabilities = [12.18/13.83, 1.35/13.83, 0.30/13.83]
              = [0.88, 0.10, 0.02]
              = [88% positive, 10% neutral, 2% negative]
          ↓
prediction = argmax = 0 (POSITIVE)
confidence = 0.88 (88%)
```

### 5.3 Công thức Softmax

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║      P(class = k) = exp(z_k) / sum(exp(z_j))            ║
║                                                          ║
║  Trong đó:                                               ║
║  • z_k = logit của class k (điểm thô từ model)          ║
║  • exp(x) = e^x (hàm mũ)                                ║
║  • Tổng xác suất = 1 (100%)                              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

Ví dụ:
logits = [2.5, 0.3, -1.2]

exp(2.5) = 12.18
exp(0.3) = 1.35
exp(-1.2) = 0.30
Tổng = 13.83

P(positive) = 12.18 / 13.83 = 0.88 = 88%
P(neutral)  = 1.35 / 13.83  = 0.10 = 10%
P(negative) = 0.30 / 13.83  = 0.02 = 2%
```

---

## 6. PHÁT HIỆN NỘI DUNG NHẠY CẢM

### 6.1 Từ khóa được định nghĩa

```python
# File: backend/src/config/settings.py (dòng 31-32)

VIOLENCE_KEYWORDS = ["bạo lực", "đánh", "giết", "violence", "kill", "attack"]
POLITICAL_KEYWORDS = ["chính trị", "chính phủ", "đảng", "political", "government", "party"]
```

### 6.2 Hàm phát hiện

```python
# File: backend/src/services/sentiment_analyzer.py (dòng 111-128)

def detect_content_type(self, text: str) -> Tuple[ContentType, List[str]]:
    text_lower = text.lower()
    detected_keywords = []
    
    # Kiểm tra từ khóa bạo lực
    violence_found = [kw for kw in settings.VIOLENCE_KEYWORDS if kw.lower() in text_lower]
    if violence_found:
        return ContentType.VIOLENCE, violence_found
    
    # Kiểm tra từ khóa chính trị
    political_found = [kw for kw in settings.POLITICAL_KEYWORDS if kw.lower() in text_lower]
    if political_found:
        return ContentType.POLITICAL, political_found
    
    return ContentType.NORMAL, []
```

**Lý thuyết Keyword Matching:**

```
Thuật toán đơn giản:
1. Chuyển text sang chữ thường
2. Duyệt qua danh sách từ khóa
3. Kiểm tra từ khóa có trong text không
4. Trả về loại nội dung + từ khóa tìm thấy

Ưu điểm:
• Nhanh, không cần model AI
• Dễ mở rộng (thêm từ khóa)

Nhược điểm:
• Có thể bỏ sót biến thể ("giết" vs "sát hại")
• Có thể false positive ("đánh răng" vs "đánh nhau")
```

---

## 7. PHÂN TÍCH HOÀN CHỈNH

### 7.1 Hàm analyze_comment

```python
# File: backend/src/services/sentiment_analyzer.py (dòng 185-206)

def analyze_comment(self, text: str) -> CommentAnalysis:
    # Phát hiện nội dung nhạy cảm
    content_type, keywords = self.detect_content_type(text)
    
    # Dự đoán cảm xúc
    if self.model:
        sentiment, confidence = self.predict_sentiment_ml(text)
    else:
        sentiment = SentimentLabel.NEUTRAL
        confidence = 0.5
    
    # Trả về kết quả
    return CommentAnalysis(
        text=text,
        sentiment=sentiment,
        confidence=confidence,
        content_type=content_type,
        keywords_detected=keywords
    )
```

### 7.2 Luồng xử lý hoàn chỉnh

```
INPUT: "Sản phẩm này đánh bại mọi đối thủ!"
        │
        ▼
┌─────────────────────────────────────────┐
│ detect_content_type()                    │
│ • Tìm thấy: "đánh" trong VIOLENCE_KEYWORDS│
│ • Kết quả: VIOLENCE, ["đánh"]            │
│                                          │
│ (Lưu ý: "đánh bại" là nghĩa bóng,        │
│  đây là hạn chế của keyword matching)    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│ predict_sentiment_ml()                   │
│ • Tiền xử lý → Tokenize → PhoBERT       │
│ • logits = [3.1, 0.2, -1.8]             │
│ • softmax = [0.95, 0.04, 0.01]          │
│ • Kết quả: POSITIVE, 95%                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
OUTPUT:
{
    "text": "Sản phẩm này đánh bại mọi đối thủ!",
    "sentiment": "positive",
    "confidence": 0.95,
    "content_type": "violence",
    "keywords_detected": ["đánh"]
}
```

---

## 8. CẤU TRÚC DỮ LIỆU OUTPUT

### 8.1 CommentAnalysis

```python
# File: backend/src/models/sentiment.py (dòng 19-25)

class CommentAnalysis(BaseModel):
    text: str                              # Văn bản gốc
    sentiment: SentimentLabel              # Nhãn cảm xúc
    confidence: float                      # Độ tin cậy (0.0 - 1.0)
    content_type: ContentType              # Loại nội dung
    keywords_detected: List[str]           # Từ khóa phát hiện
```

### 8.2 SentimentStats

```python
# File: backend/src/models/sentiment.py (dòng 33-42)

class SentimentStats(BaseModel):
    total_comments: int           # Tổng số bình luận
    positive_count: int           # Số bình luận tích cực
    negative_count: int           # Số bình luận tiêu cực
    neutral_count: int            # Số bình luận trung tính
    positive_percentage: float    # Phần trăm tích cực
    negative_percentage: float    # Phần trăm tiêu cực
    neutral_percentage: float     # Phần trăm trung tính
    average_confidence: float     # Độ tin cậy trung bình
```

**Công thức tính thống kê:**

```
positive_percentage = (positive_count / total_comments) × 100%
negative_percentage = (negative_count / total_comments) × 100%
neutral_percentage  = (neutral_count / total_comments) × 100%

average_confidence = sum(confidence_i) / total_comments
```

---

## 9. TÓM TẮT CÔNG THỨC TRONG PROJECT

| # | Công thức | File | Dòng | Mục đích |
|:-:|:----------|:-----|:----:|:---------|
| 1 | `text.lower()` | data_processor.py | 20 | Chữ thường |
| 2 | `re.sub(pattern, '', text)` | data_processor.py | 23 | Xóa URL |
| 3 | `tokenizer(text)` | sentiment_analyzer.py | 141 | Tách từ |
| 4 | `model(**inputs)` | sentiment_analyzer.py | 146 | Forward pass |
| 5 | `softmax(logits)` | sentiment_analyzer.py | 148 | Tính xác suất |
| 6 | `argmax(probs)` | sentiment_analyzer.py | 149 | Lấy nhãn |
| 7 | `keyword in text` | sentiment_analyzer.py | 117 | Phát hiện nội dung |
| 8 | `count/total × 100` | API routes | - | Phần trăm |

---

## 10. DIAGRAM TỔNG HỢP

```
                              USER INPUT
                                  │
                    "Sản phẩm tốt quá! 👍"
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA PROCESSOR                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  clean_text()                                                │    │
│  │  • lower() → "sản phẩm tốt quá! 👍"                          │    │
│  │  • Xóa URL, @ , #                                            │    │
│  │  • Chuẩn hóa spaces                                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SENTIMENT ANALYZER                              │
│                                                                      │
│  ┌───────────────────┐    ┌───────────────────┐                     │
│  │ detect_content()  │    │ preprocess_text() │                     │
│  │ • Keyword match   │    │ • Xóa ký tự ĐB    │                     │
│  │ • Return: NORMAL  │    │ • Giữ tiếng Việt  │                     │
│  └───────────────────┘    └─────────┬─────────┘                     │
│                                     │                                │
│                                     ▼                                │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ TOKENIZER (AutoTokenizer)                                │        │
│  │ → ["<s>", "sản", "phẩm", "tốt", "quá", "</s>"]          │        │
│  │ → [0, 1234, 5678, 9012, 3456, 2]                         │        │
│  └───────────────────────────┬─────────────────────────────┘        │
│                              │                                       │
│                              ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ PHOBERT MODEL                                            │        │
│  │ ┌─────────────────────────────────────────────────────┐ │        │
│  │ │ Embedding Layer (768 chiều mỗi token)               │ │        │
│  │ └───────────────────────────┬─────────────────────────┘ │        │
│  │                             │                           │        │
│  │ ┌───────────────────────────▼─────────────────────────┐ │        │
│  │ │ 12 × Transformer Layer                              │ │        │
│  │ │ • Multi-Head Self-Attention (12 heads)              │ │        │
│  │ │ • Feed-Forward Network (768→3072→768)               │ │        │
│  │ │ • Layer Normalization + Residual                    │ │        │
│  │ └───────────────────────────┬─────────────────────────┘ │        │
│  │                             │                           │        │
│  │ ┌───────────────────────────▼─────────────────────────┐ │        │
│  │ │ Classification Head                                 │ │        │
│  │ │ 768 → 3 (positive, neutral, negative)               │ │        │
│  │ └───────────────────────────┬─────────────────────────┘ │        │
│  └─────────────────────────────┼───────────────────────────┘        │
│                                │                                     │
│                                ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │ SOFTMAX                                                  │        │
│  │ logits = [2.8, 0.3, -1.5]                               │        │
│  │ probs = [0.92, 0.07, 0.01]                              │        │
│  │ → POSITIVE, confidence = 92%                            │        │
│  └─────────────────────────────────────────────────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           OUTPUT                                     │
│  {                                                                   │
│    "text": "Sản phẩm tốt quá! 👍",                                  │
│    "sentiment": "positive",                                          │
│    "confidence": 0.92,                                               │
│    "content_type": "normal",                                         │
│    "keywords_detected": []                                           │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 LINKS ĐẾN CODE

- [sentiment_analyzer.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/services/sentiment_analyzer.py) - Phân tích cảm xúc
- [data_processor.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/services/data_processor.py) - Xử lý dữ liệu
- [sentiment.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/models/sentiment.py) - Models
- [settings.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/config/settings.py) - Cấu hình
