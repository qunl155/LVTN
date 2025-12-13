# 🧠 HƯỚNG DẪN CHI TIẾT: CÁCH MÔ HÌNH PHOBERT PHÂN TÍCH CẢM XÚC

---

## 📖 MỤC LỤC

1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Bước 1: Tiền xử lý văn bản](#2-bước-1-tiền-xử-lý-văn-bản)
3. [Bước 2: Tokenization](#3-bước-2-tokenization)
4. [Bước 3: Embedding](#4-bước-3-embedding)
5. [Bước 4: Transformer Layers](#5-bước-4-transformer-layers)
6. [Bước 5: Classification](#6-bước-5-classification)
7. [Bước 6: Softmax và Kết quả](#7-bước-6-softmax-và-kết-quả)
8. [Ví dụ thực tế từ A-Z](#8-ví-dụ-thực-tế-từ-a-z)

---

## 1. GIỚI THIỆU TỔNG QUAN

### 1.1 PhoBERT là gì?

**PhoBERT** = **Pho**netic **B**idirectional **E**ncoder **R**epresentations from **T**ransformers

Đây là mô hình AI được phát triển bởi **VinAI Research** (Việt Nam) để hiểu ngôn ngữ tiếng Việt. Mô hình được huấn luyện trên **20GB dữ liệu tiếng Việt** từ báo chí và Wikipedia.

### 1.2 Mô hình phân loại cảm xúc

```
┌─────────────────────────────────────────────────────────┐
│                    HỆ THỐNG CỦA BẠN                     │
├─────────────────────────────────────────────────────────┤
│  INPUT:  "Sản phẩm này rất tuyệt vời!"                  │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              PHOBERT MODEL                       │   │
│  │  (Đã được fine-tune cho phân tích cảm xúc)      │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  OUTPUT: POSITIVE (Tích cực) - Độ tin cậy: 95%         │
└─────────────────────────────────────────────────────────┘
```

### 1.3 Ba loại cảm xúc

| Số thứ tự | Nhãn | Tiếng Việt | Biểu tượng |
|:---------:|:-----|:-----------|:----------:|
| 0 | POSITIVE | Tích cực | 😊 |
| 1 | NEUTRAL | Trung tính | 😐 |
| 2 | NEGATIVE | Tiêu cực | 😟 |

---

## 2. BƯỚC 1: TIỀN XỬ LÝ VĂN BẢN

### 2.1 Mục đích
Làm sạch văn bản để mô hình dễ hiểu hơn.

### 2.2 Các bước xử lý

```
INPUT GỐC:
"Sản Phẩm NÀY TUYỆT VỜI!!! 👍 https://example.com @shop"

                    ↓ Bước 1: Chuyển chữ thường
                    
"sản phẩm này tuyệt vời!!! 👍 https://example.com @shop"

                    ↓ Bước 2: Xóa URL
                    
"sản phẩm này tuyệt vời!!! 👍  @shop"

                    ↓ Bước 3: Xóa ký tự đặc biệt
                    
"sản phẩm này tuyệt vời shop"

                    ↓ Bước 4: Xóa khoảng trắng thừa
                    
OUTPUT SAU XỬ LÝ:
"sản phẩm này tuyệt vời shop"
```

### 2.3 Code thực hiện

```python
def preprocess_text(self, text):
    # Bước 1: Chuyển chữ thường
    text = text.lower()
    
    # Bước 2: Xóa URL
    text = re.sub(r'http\S+|www.\S+', '', text)
    
    # Bước 3: Xóa ký tự đặc biệt (giữ tiếng Việt)
    text = re.sub(r'[^\w\s...ký tự tiếng Việt...]', '', text)
    
    # Bước 4: Xóa khoảng trắng thừa
    text = ' '.join(text.split())
    
    return text
```

---

## 3. BƯỚC 2: TOKENIZATION (TÁCH TỪ)

### 3.1 Tokenization là gì?
**Tokenization** = Quá trình chia văn bản thành các đơn vị nhỏ gọi là **tokens**.

### 3.2 BPE (Byte Pair Encoding)

PhoBERT sử dụng thuật toán **BPE** - một phương pháp thông minh để tách từ:

```
VÍ DỤ 1: Từ phổ biến
─────────────────────
Input:  "tuyệt vời"
Output: ["tuyệt", "vời"]
         (Mỗi từ là 1 token riêng vì chúng phổ biến)

VÍ DỤ 2: Từ hiếm gặp
─────────────────────
Input:  "blockbuster"
Output: ["block", "buster"]
         (Từ hiếm bị tách thành các phần nhỏ hơn)

VÍ DỤ 3: Câu hoàn chỉnh
─────────────────────────
Input:  "sản phẩm tuyệt vời"
Output: ["<s>", "sản", "phẩm", "tuyệt", "vời", "</s>"]
         
         Giải thích:
         • <s>   = Token bắt đầu câu (Start)
         • </s>  = Token kết thúc câu (End)
```

### 3.3 Chuyển Token thành số (Token IDs)

Mỗi token được gán một số ID duy nhất:

```
Tokens:    ["<s>",  "sản",   "phẩm",  "tuyệt", "vời",  "</s>"]
              ↓      ↓        ↓        ↓       ↓       ↓
Token IDs: [  0,    1257,    3456,    5678,   9012,     2  ]
```

### 3.4 Ý nghĩa
- **Mô hình không hiểu chữ**, chỉ hiểu **số**
- Bảng từ điển (vocab) chứa ~64,000 tokens
- Token ID 0 = `<s>`, Token ID 2 = `</s>`

---

## 4. BƯỚC 3: EMBEDDING (NHÚNG TỪ)

### 4.1 Embedding là gì?

**Embedding** = Chuyển đổi mỗi token (số) thành một **vector** (danh sách các số).

```
Tại sao cần Embedding?
─────────────────────────
• Token ID chỉ là số đơn lẻ, không chứa nghĩa
• Vector embedding chứa thông tin ngữ nghĩa
• Vector có 768 chiều (768 số thực)
```

### 4.2 Ba loại Embedding

```
CÔNG THỨC EMBEDDING:
────────────────────
E = E_token + E_position + E_segment

Trong đó:
• E         = Vector embedding cuối cùng (768 số)
• E_token   = Vector nghĩa của từ
• E_position = Vector vị trí của từ trong câu
• E_segment = Vector phân biệt câu (thường = 0)
```

### 4.3 Giải thích chi tiết từng loại

**📌 Token Embedding (E_token):**
```
Mỗi từ có một vector 768 chiều riêng, lưu trong bảng tra cứu.

Ví dụ:
• "sản"   → [0.12, -0.34, 0.56, ..., 0.78]  (768 số)
• "phẩm"  → [0.21, 0.45, -0.12, ..., 0.33]  (768 số)
• "tốt"   → [0.89, 0.23, 0.67, ..., 0.11]  (768 số)

Các từ có nghĩa tương tự sẽ có vector gần nhau:
• "tốt" và "tuyệt" có vector gần nhau
• "tốt" và "xấu" có vector xa nhau
```

**📌 Position Embedding (E_position):**
```
Cho mô hình biết vị trí của từ trong câu.

Câu: "Sản phẩm rất tốt"
       ↓    ↓   ↓   ↓
Vị trí: 1    2   3   4

Mỗi vị trí có 1 vector riêng:
• Vị trí 1 → [0.01, 0.02, -0.03, ...]
• Vị trí 2 → [0.05, -0.01, 0.04, ...]
• ...

Tại sao cần vị trí?
• "Tôi không thích nó" ≠ "Nó không thích tôi"
• Thứ tự từ thay đổi nghĩa của câu
```

**📌 Segment Embedding (E_segment):**
```
Dùng để phân biệt câu A và câu B (trong bài toán so sánh 2 câu).

Trong phân tích cảm xúc (chỉ 1 câu):
• Tất cả token đều có segment = 0
• E_segment thường là vector toàn 0
```

### 4.4 Ví dụ tính Embedding

```
Câu: "sản phẩm tốt" (3 từ + 2 token đặc biệt = 5 tokens)

Token "sản" ở vị trí 1:
───────────────────────
E_token["sản"]    = [0.12, -0.34, 0.56, ...]
E_position[1]     = [0.01,  0.02, 0.03, ...]
E_segment[0]      = [0.00,  0.00, 0.00, ...]
────────────────────────────────────────────
E["sản"]          = [0.13, -0.32, 0.59, ...]

Kết quả: Ma trận Embedding kích thước (5 x 768)
• 5 tokens, mỗi token là 1 vector 768 chiều
```

---

## 5. BƯỚC 4: TRANSFORMER LAYERS

### 5.1 Tổng quan

PhoBERT có **12 lớp Transformer**, mỗi lớp gồm 2 phần:
1. **Self-Attention**: Học mối quan hệ giữa các từ
2. **Feed-Forward Network**: Xử lý thông tin

```
Input Embedding
      ↓
┌─────────────────────────┐
│   TRANSFORMER LAYER 1   │
│  ┌───────────────────┐  │
│  │  Self-Attention   │  │
│  └─────────┬─────────┘  │
│            ↓            │
│  ┌───────────────────┐  │
│  │  Feed-Forward NN  │  │
│  └─────────┬─────────┘  │
└────────────┼────────────┘
             ↓
┌─────────────────────────┐
│   TRANSFORMER LAYER 2   │
│        ... ...          │
└────────────┬────────────┘
             ↓
        (lặp lại 12 lần)
             ↓
      Output Vectors
```

---

### 5.2 SELF-ATTENTION (Chi tiết)

#### 5.2.1 Ý tưởng chính

Self-Attention giúp mô hình hiểu **mối quan hệ giữa các từ trong câu**.

```
VÍ DỤ:
──────
Câu: "Sản phẩm này không tốt"

Khi xử lý từ "tốt", mô hình cần biết:
• "không" đứng trước "tốt" → nghĩa đảo ngược
• "tốt" liên quan đến "sản phẩm" (không phải ngẫu nhiên)

Self-Attention cho phép mỗi từ "nhìn" vào TẤT CẢ các từ khác.
```

#### 5.2.2 Ba vector: Query, Key, Value

Mỗi từ tạo ra 3 vector:

```
┌────────────────────────────────────────────────────────┐
│  QUERY (Q) - "Câu hỏi"                                 │
│  ─────────────────────                                 │
│  • Đại diện cho từ HIỆN TẠI đang được xử lý            │
│  • Hỏi: "Tôi cần chú ý đến từ nào?"                    │
│                                                        │
│  KEY (K) - "Chìa khóa"                                 │
│  ─────────────────────                                 │
│  • Đại diện cho TẤT CẢ các từ trong câu                │
│  • Trả lời: "Tôi có thông tin gì có thể hữu ích?"      │
│                                                        │
│  VALUE (V) - "Giá trị"                                 │
│  ─────────────────────                                 │
│  • Chứa thông tin THỰC SỰ của mỗi từ                   │
│  • Đây là thông tin sẽ được truyền đi                  │
└────────────────────────────────────────────────────────┘
```

#### 5.2.3 Cách tính Q, K, V

```
CÔNG THỨC:
──────────
Q = X × W_Q    (Ma trận đầu vào × Ma trận trọng số Query)
K = X × W_K    (Ma trận đầu vào × Ma trận trọng số Key)
V = X × W_V    (Ma trận đầu vào × Ma trận trọng số Value)

Trong đó:
• X    = Ma trận embedding đầu vào, kích thước (n × 768)
         n = số token trong câu
• W_Q  = Ma trận trọng số Query, kích thước (768 × 64)
• W_K  = Ma trận trọng số Key, kích thước (768 × 64)
• W_V  = Ma trận trọng số Value, kích thước (768 × 64)

Kết quả:
• Q, K, V đều có kích thước (n × 64)
```

#### 5.2.4 Tính điểm Attention

```
BƯỚC 1: Tính độ tương đồng
──────────────────────────
Điểm = Q × K^T

Ý nghĩa: Nhân Query của từ hiện tại với Key của tất cả từ khác
         để xem từ nào "khớp" nhất.

Kết quả: Ma trận (n × n) - điểm tương đồng giữa mọi cặp từ


BƯỚC 2: Chia tỷ lệ (Scaling)
────────────────────────────
Điểm_scaled = Điểm ÷ căn(64)
            = Điểm ÷ 8

Tại sao chia cho căn(d_k)?
• d_k = 64 (số chiều của Key)
• Nếu không chia, điểm quá lớn → gradient không ổn định
• Chia để giữ điểm trong khoảng hợp lý


BƯỚC 3: Softmax (Chuẩn hóa thành xác suất)
──────────────────────────────────────────
Trọng_số = softmax(Điểm_scaled)

Ví dụ:
• Điểm_scaled = [2.5, 0.3, -1.2]
• Sau softmax  = [0.88, 0.10, 0.02]

Ý nghĩa: Tổng các trọng số = 1 (100%)


BƯỚC 4: Nhân với Value
──────────────────────
Output = Trọng_số × V

Ý nghĩa: Lấy tổng có trọng số của các Value
         Từ nào có trọng số cao → đóng góp nhiều hơn
```

#### 5.2.5 Công thức tổng hợp

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   Attention(Q, K, V) = softmax( (Q × K^T) ÷ căn(d_k) ) × V ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Diễn giải bằng lời:
1. Nhân Query với Key chuyển vị để tính độ tương đồng
2. Chia cho căn của 64 để ổn định
3. Áp dụng softmax để có xác suất
4. Nhân với Value để lấy thông tin
```

#### 5.2.6 Ví dụ trực quan

```
Câu: "Sản phẩm rất tốt"
      [0]   [1]  [2] [3]

Ma trận Attention sau softmax:

              Sản    phẩm   rất    tốt
           ┌──────┬──────┬──────┬──────┐
Sản        │ 0.40 │ 0.30 │ 0.15 │ 0.15 │  → Sản chú ý đến phẩm
           ├──────┼──────┼──────┼──────┤
phẩm       │ 0.35 │ 0.40 │ 0.10 │ 0.15 │  → phẩm chú ý đến Sản
           ├──────┼──────┼──────┼──────┤
rất        │ 0.10 │ 0.10 │ 0.30 │ 0.50 │  → rất chú ý đến tốt ⭐
           ├──────┼──────┼──────┼──────┤
tốt        │ 0.15 │ 0.20 │ 0.45 │ 0.20 │  → tốt chú ý đến rất ⭐
           └──────┴──────┴──────┴──────┘

Nhận xét:
• "rất" và "tốt" có attention cao với nhau (0.50 và 0.45)
• Điều này hợp lý vì "rất" bổ nghĩa cho "tốt"
• "Sản" và "phẩm" cũng có attention cao với nhau (0.30 và 0.35)
```

---

### 5.3 MULTI-HEAD ATTENTION

#### 5.3.1 Tại sao cần nhiều Head?

```
Mỗi "Head" học một loại quan hệ khác nhau:

Head 1: Quan hệ chủ ngữ - động từ
        "Tôi" ←→ "thích"

Head 2: Quan hệ tính từ - danh từ
        "tốt" ←→ "sản phẩm"

Head 3: Quan hệ phủ định
        "không" ←→ "tốt"

Head 4: Quan hệ đại từ
        "nó" ←→ "sản phẩm"

... (PhoBERT có 12 heads)
```

#### 5.3.2 Cách hoạt động

```
CÔNG THỨC:
──────────
MultiHead = Concat(head_1, head_2, ..., head_12) × W_O

Trong đó:
• head_i  = Kết quả attention của head thứ i (kích thước n × 64)
• Concat  = Ghép 12 heads lại thành (n × 768)
• W_O     = Ma trận output, kích thước (768 × 768)

Quá trình:
1. Chạy 12 attention heads song song
2. Mỗi head cho output (n × 64)
3. Ghép 12 outputs: (n × 64) × 12 = (n × 768)
4. Nhân với W_O để kết hợp thông tin
```

---

### 5.4 FEED-FORWARD NETWORK

#### 5.4.1 Cấu trúc

```
Sau Self-Attention, mỗi vector đi qua một mạng neural đơn giản:

Input (768 chiều)
       ↓
┌─────────────────────┐
│ Fully Connected 1   │
│ 768 → 3072 chiều    │
│ (Mở rộng lên 4 lần) │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    GELU Activation  │
│ (Hàm kích hoạt)     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Fully Connected 2   │
│ 3072 → 768 chiều    │
│ (Thu nhỏ về ban đầu)│
└──────────┬──────────┘
           ↓
Output (768 chiều)
```

#### 5.4.2 Công thức

```
CÔNG THỨC FFN:
──────────────
FFN(x) = GELU(x × W1 + b1) × W2 + b2

Trong đó:
• x   = Vector đầu vào (768 chiều)
• W1  = Ma trận trọng số 1, kích thước (768 × 3072)
• b1  = Bias 1 (3072 chiều)
• W2  = Ma trận trọng số 2, kích thước (3072 × 768)
• b2  = Bias 2 (768 chiều)
• GELU = Hàm kích hoạt (Gaussian Error Linear Unit)
```

#### 5.4.3 Hàm GELU

```
GELU là gì?
───────────
• Một loại hàm kích hoạt (giống ReLU nhưng mượt hơn)
• Giúp mô hình học các quan hệ phi tuyến

CÔNG THỨC GELU (xấp xỉ):
────────────────────────
GELU(x) ≈ 0.5 × x × (1 + tanh(0.7978 × (x + 0.0356 × x³)))

Đồ thị (so sánh với ReLU):

     │
  2  ┤          ╱  ← GELU (đường cong mượt)
     │        ╱
  1  ┤      ╱
     │    ╱
  0  ┼──╱─────────
     │╱        
 -1  ┤
     └──┬──┬──┬──┬──
       -2 -1  0  1  2
```

---

### 5.5 RESIDUAL CONNECTION + LAYER NORMALIZATION

#### 5.5.1 Residual Connection (Kết nối tắt)

```
Ý tưởng: Cộng input ban đầu vào output

Tại sao?
• Giúp gradient chảy dễ dàng qua nhiều lớp
• Tránh hiện tượng "vanishing gradient"
• Mô hình có thể học "không làm gì" nếu cần

CÔNG THỨC:
──────────
Output = Input + Sublayer(Input)

Ví dụ:
• x = [0.5, 0.3, 0.2, ...]          (Input)
• Attention(x) = [0.1, -0.1, 0.2, ...] (Output từ Attention)
• Kết quả = [0.6, 0.2, 0.4, ...]    (Cộng lại)
```

#### 5.5.2 Layer Normalization

```
Mục đích: Chuẩn hóa để training ổn định

CÔNG THỨC:
──────────
LayerNorm(x) = gamma × (x - trung_bình) ÷ căn(phương_sai + epsilon) + beta

Trong đó:
• x            = Vector đầu vào (768 chiều)
• trung_bình   = Giá trị trung bình của 768 phần tử
• phương_sai   = Phương sai của 768 phần tử
• epsilon      = Số rất nhỏ (0.000001) để tránh chia cho 0
• gamma, beta  = Tham số học được

Ví dụ:
• Input: [2, 4, 6, 8]
• Trung bình = 5
• Phương sai = 5
• Output = gamma × [(2-5)/2.24, (4-5)/2.24, ...] + beta
         = gamma × [-1.34, -0.45, 0.45, 1.34] + beta
```

---

## 6. BƯỚC 5: CLASSIFICATION (PHÂN LOẠI)

### 6.1 Lấy vector đại diện cho câu

```
Sau khi đi qua 12 Transformer layers:

Tokens: [<s>, "sản", "phẩm", "tốt", </s>]
Vectors: [h0,   h1,    h2,    h3,   h4]
          ↑
          │
          └── h0 (vector của <s>) được dùng làm đại diện cho CẢ CÂU

Tại sao dùng token <s>?
• Vị trí đầu tiên, "nhìn thấy" toàn bộ câu qua attention
• Chứa thông tin tổng hợp của câu
```

### 6.2 Lớp phân loại (Classification Layer)

```
CÔNG THỨC:
──────────
logits = h0 × W_c + b_c

Trong đó:
• h0    = Vector CLS (768 chiều) - đại diện câu
• W_c   = Ma trận phân loại (768 × 3)
• b_c   = Bias (3 chiều)
• logits = Điểm thô cho 3 lớp (3 chiều)

Ví dụ:
• h0 = [0.5, 0.3, -0.2, ..., 0.1]  (768 số)
• W_c = ma trận (768 × 3)
• logits = [2.5, 0.3, -1.2]
           ↑    ↑     ↑
         POS  NEU   NEG
```

---

## 7. BƯỚC 6: SOFTMAX VÀ KẾT QUẢ

### 7.1 Hàm Softmax

```
Chuyển logits (điểm thô) thành xác suất (tổng = 100%)

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           P(lớp_k) = e^(z_k) ÷ tổng(e^(z_j))              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Giải thích:
• z_k = logit của lớp k
• e   = số Euler ≈ 2.718
• e^x = hàm mũ (luôn dương)
• Chia cho tổng để chuẩn hóa thành xác suất
```

### 7.2 Ví dụ tính Softmax từng bước

```
BƯỚC 1: Có logits
─────────────────
logits = [2.5, 0.3, -1.2]
          ↑    ↑     ↑
         POS  NEU   NEG


BƯỚC 2: Tính e mũ cho từng logit
────────────────────────────────
e^2.5  = 12.18  (positive)
e^0.3  = 1.35   (neutral)
e^-1.2 = 0.30   (negative)


BƯỚC 3: Tính tổng
─────────────────
Tổng = 12.18 + 1.35 + 0.30 = 13.83


BƯỚC 4: Chia để có xác suất
───────────────────────────
P(positive) = 12.18 ÷ 13.83 = 0.88 = 88%
P(neutral)  = 1.35 ÷ 13.83  = 0.10 = 10%
P(negative) = 0.30 ÷ 13.83  = 0.02 = 2%

Tổng xác suất = 88% + 10% + 2% = 100% ✓


BƯỚC 5: Lấy kết quả
───────────────────
Nhãn dự đoán = lớp có xác suất cao nhất = POSITIVE
Độ tin cậy   = xác suất của nhãn đó = 88%
```

### 7.3 Code thực hiện

```python
# Sau khi có logits từ model
logits = outputs.logits  # [2.5, 0.3, -1.2]

# Áp dụng softmax
probabilities = torch.softmax(logits, dim=1)[0]
# probabilities = [0.88, 0.10, 0.02]

# Lấy nhãn có xác suất cao nhất
prediction = torch.argmax(probabilities).item()  # = 0 (positive)

# Lấy độ tin cậy
confidence = float(probabilities[prediction])    # = 0.88 (88%)
```

---

## 8. VÍ DỤ THỰC TẾ TỪ A-Z

### Input ban đầu:
```
"Sản phẩm này TUYỆT VỜI!!! 👍👍👍"
```

### Bước 1: Tiền xử lý
```
→ "sản phẩm này tuyệt vời"
```

### Bước 2: Tokenization
```
→ Tokens: ["<s>", "sản", "phẩm", "này", "tuyệt", "vời", "</s>"]
→ IDs:    [0, 1257, 3456, 789, 5678, 9012, 2]
```

### Bước 3: Embedding
```
→ Ma trận (7 × 768)
   Mỗi hàng là 1 vector 768 chiều
```

### Bước 4: 12 Transformer Layers
```
→ Ma trận (7 × 768) đã được "tinh chỉnh"
   Các từ đã "nhìn thấy" nhau qua attention
```

### Bước 5: Lấy vector CLS
```
→ h0 = vector đầu tiên, 768 chiều
```

### Bước 6: Classification
```
→ logits = h0 × W_c + b_c = [3.2, 0.5, -2.1]
```

### Bước 7: Softmax
```
e^3.2 = 24.53
e^0.5 = 1.65
e^-2.1 = 0.12
Tổng = 26.30

P(positive) = 24.53 / 26.30 = 93.3%
P(neutral)  = 1.65 / 26.30  = 6.3%
P(negative) = 0.12 / 26.30  = 0.4%
```

### Kết quả cuối cùng:
```
┌─────────────────────────────────────────────────────────┐
│  KẾT QUẢ PHÂN TÍCH                                      │
├─────────────────────────────────────────────────────────┤
│  📝 Bình luận: "Sản phẩm này TUYỆT VỜI!!! 👍👍👍"       │
│  😊 Cảm xúc:   POSITIVE (Tích cực)                      │
│  📊 Độ tin cậy: 93.3%                                   │
│                                                         │
│  Chi tiết xác suất:                                     │
│  ├── Tích cực:    ████████████████████ 93.3%           │
│  ├── Trung tính:  █ 6.3%                                │
│  └── Tiêu cực:    ▏ 0.4%                                │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 TÓM TẮT CÁC CÔNG THỨC

| # | Tên | Công thức | Mục đích |
|:-:|:----|:----------|:---------|
| 1 | Embedding | E = E_token + E_position + E_segment | Nhúng từ vào vector |
| 2 | Query/Key/Value | Q=XW_Q, K=XW_K, V=XW_V | Tạo 3 vector cho attention |
| 3 | Attention Score | Score = (Q × K^T) ÷ căn(d_k) | Tính độ tương đồng |
| 4 | Attention | Att = softmax(Score) × V | Lấy thông tin có trọng số |
| 5 | Multi-Head | MH = Concat(heads) × W_O | Kết hợp nhiều heads |
| 6 | FFN | FFN = GELU(xW1 + b1)W2 + b2 | Xử lý phi tuyến |
| 7 | Layer Norm | LN = gamma × (x-μ)/σ + beta | Chuẩn hóa |
| 8 | Residual | Out = x + Sublayer(x) | Kết nối tắt |
| 9 | Classification | logits = h_CLS × W_c + b_c | Tính điểm phân loại |
| 10 | Softmax | P(k) = e^z_k ÷ Σe^z_j | Chuyển thành xác suất |

---

## 🔗 THAM KHẢO

- Code chính: [sentiment_analyzer.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/services/sentiment_analyzer.py)
- PhoBERT paper: [PhoBERT: Pre-trained language models for Vietnamese](https://arxiv.org/abs/2003.00744)
- Transformer paper: [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
