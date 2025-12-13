# 📚 LÝ THUYẾT ĐẦY ĐỦ: MÔ HÌNH PHOBERT PHÂN TÍCH CẢM XÚC

---

# PHẦN A: NỀN TẢNG LÝ THUYẾT

---

## 1. XỬ LÝ NGÔN NGỮ TỰ NHIÊN (NLP)

### 1.1 NLP là gì?

**NLP (Natural Language Processing)** = Xử lý ngôn ngữ tự nhiên

```
Định nghĩa:
──────────
NLP là nhánh của Trí tuệ nhân tạo (AI) giúp máy tính
hiểu, phân tích và tạo ra ngôn ngữ của con người.
```

### 1.2 Các bài toán NLP phổ biến

| Bài toán | Mô tả | Ví dụ |
|:---------|:------|:------|
| Phân loại văn bản | Gán nhãn cho văn bản | Spam/Không spam |
| Phân tích cảm xúc | Xác định cảm xúc | Tích cực/Tiêu cực |
| Nhận dạng thực thể | Tìm tên người, địa điểm | "Hà Nội" → Địa điểm |
| Dịch máy | Dịch ngôn ngữ | Việt → Anh |
| Hỏi đáp | Trả lời câu hỏi | Chatbot |
| Tóm tắt văn bản | Rút gọn nội dung | Tóm tắt báo |

### 1.3 Thách thức của NLP

```
1. TÍNH ĐA NGHĨA
   ─────────────
   • "Bank" = Ngân hàng hay Bờ sông?
   • "Đánh" = Đánh đàn hay Đánh nhau?

2. NGỮ CẢNH
   ─────────
   • "Không tệ" = Tốt (phủ định của phủ định)
   • "Tốt thật đấy" = Có thể là mỉa mai

3. TIẾNG VIỆT ĐẶC BIỆT
   ────────────────────
   • Không có dấu cách giữa các từ ghép: "học sinh"
   • Thanh điệu thay đổi nghĩa: "ma", "má", "mà", "mả", "mã", "mạ"
   • Từ đồng âm nhiều: "sao" (sao chép, ngôi sao, tại sao)
```

---

## 2. DEEP LEARNING (HỌC SÂU)

### 2.1 Neural Network (Mạng nơ-ron)

```
NEURON NHÂN TẠO
───────────────
Mô phỏng cách hoạt động của tế bào thần kinh trong não

        x1 ──┬──(w1)──┐
              │        │
        x2 ──┼──(w2)──┼──→ [Σ] → [f] → output
              │        │
        x3 ──┴──(w3)──┘

Trong đó:
• x1, x2, x3 = Các đầu vào (inputs)
• w1, w2, w3 = Trọng số (weights) - mức độ quan trọng
• Σ = Tổng có trọng số = x1×w1 + x2×w2 + x3×w3 + bias
• f = Hàm kích hoạt (activation function)
• output = Kết quả đầu ra
```

### 2.2 Công thức Neuron

```
CÔNG THỨC CƠ BẢN:
─────────────────
output = f(w1×x1 + w2×x2 + ... + wn×xn + b)
       = f(Σ wixi + b)

Trong đó:
• wi = Trọng số thứ i (weight)
• xi = Đầu vào thứ i (input)
• b  = Độ lệch (bias)
• f  = Hàm kích hoạt
```

### 2.3 Các hàm kích hoạt phổ biến

```
1. SIGMOID
   ────────
   f(x) = 1 / (1 + e^(-x))
   
   • Output: 0 đến 1
   • Dùng cho: Xác suất, phân loại nhị phân
   
   Đồ thị:
   1 ┤        ╭────
     │      ╱
 0.5┤────╱
     │  ╱
   0 ┤╱
     └────────────


2. RELU (Rectified Linear Unit)
   ─────────────────────────────
   f(x) = max(0, x)
   
   • Output: 0 hoặc x (nếu x > 0)
   • Dùng cho: Hidden layers
   
   Đồ thị:
     │    ╱
     │  ╱
     │╱
   ──┼────────
     │


3. SOFTMAX
   ────────
   f(xi) = e^(xi) / Σe^(xj)
   
   • Output: Xác suất (tổng = 1)
   • Dùng cho: Phân loại nhiều lớp


4. GELU (được dùng trong BERT)
   ────────────────────────────
   f(x) ≈ 0.5×x×(1 + tanh(0.7978×(x + 0.0356×x³)))
   
   • Mượt hơn ReLU
   • Hiệu quả cho NLP
```

### 2.4 Deep Neural Network

```
MẠNG NHIỀU LỚP
──────────────

Input     Hidden Layer 1    Hidden Layer 2    Output
Layer

 [x1]         [h1]              [h3]           [y1]
   ╲         ╱    ╲            ╱    ╲         ╱
    ╲       ╱      ╲          ╱      ╲       ╱
 [x2]─────[h2]──────[h4]─────[y2]
    ╱       ╲      ╱          ╲      ╱       ╲
   ╱         ╲    ╱            ╲    ╱         ╲
 [x3]         [h5]              [h5]           [y3]

• "Deep" = Có NHIỀU hidden layers (càng nhiều = càng sâu)
• PhoBERT có 12 layers → "deep learning"
```

### 2.5 Quá trình huấn luyện

```
TRAINING LOOP
─────────────

1. FORWARD PASS (Truyền xuôi)
   ───────────────────────────
   Input → Model → Dự đoán (Prediction)

2. TÍNH LOSS (Mất mát)
   ────────────────────
   Loss = Đo sự khác biệt giữa Dự đoán và Nhãn thực

3. BACKWARD PASS (Truyền ngược - Backpropagation)
   ───────────────────────────────────────────────
   Tính gradient (đạo hàm) của Loss theo từng weight

4. CẬP NHẬT WEIGHTS
   ─────────────────
   weight_mới = weight_cũ - learning_rate × gradient

5. LẶP LẠI
   ────────
   Lặp lại bước 1-4 cho đến khi Loss đủ nhỏ
```

---

## 3. WORD EMBEDDINGS (NHÚNG TỪ)

### 3.1 Tại sao cần Embedding?

```
VẤN ĐỀ: Máy tính chỉ hiểu số, không hiểu chữ

CÁCH CŨ: One-Hot Encoding
─────────────────────────
Từ điển: ["mèo", "chó", "cá"]

"mèo" = [1, 0, 0]
"chó" = [0, 1, 0]
"cá"  = [0, 0, 1]

Nhược điểm:
• Vector quá dài (từ điển 50,000 từ = vector 50,000 chiều)
• Không thể hiện quan hệ ngữ nghĩa
• "mèo" và "chó" có khoảng cách = "mèo" và "cá"


CÁCH MỚI: Word Embedding
────────────────────────
"mèo" = [0.2, 0.5, -0.1, 0.8, ...]  (300 chiều)
"chó" = [0.3, 0.4, -0.2, 0.7, ...]  (300 chiều)
"cá"  = [-0.5, 0.1, 0.9, -0.3, ...] (300 chiều)

Ưu điểm:
• Vector ngắn hơn (100-768 chiều)
• Thể hiện ngữ nghĩa
• "mèo" và "chó" gần nhau (đều là thú cưng)
```

### 3.2 Tính chất của Word Embedding

```
PHÉP TOÁN VỚI TỪ
────────────────

vector("vua") - vector("đàn ông") + vector("phụ nữ") ≈ vector("hoàng hậu")

Giải thích:
• "vua" = "đàn ông" + "quyền lực hoàng gia"
• Bỏ "đàn ông", thêm "phụ nữ" → "hoàng hậu"


CÁC TỪ TƯƠNG TỰ NẰM GẦN NHAU
────────────────────────────

     "tốt" ●
      "hay" ●     ← Các từ tích cực
    "tuyệt" ●
                      
                      
                      "xấu" ●
                    "tệ" ●     ← Các từ tiêu cực
                  "kém" ●
```

### 3.3 Các phương pháp Embedding

| Phương pháp | Năm | Đặc điểm |
|:------------|:---:|:---------|
| Word2Vec | 2013 | Vector tĩnh cho mỗi từ |
| GloVe | 2014 | Dựa trên ma trận đồng xuất hiện |
| FastText | 2016 | Xử lý được từ chưa gặp |
| ELMo | 2018 | Vector động theo ngữ cảnh |
| **BERT/PhoBERT** | 2018-2020 | Vector động, hai chiều |

---

## 4. ATTENTION MECHANISM (CƠ CHẾ CHÚ Ý)

### 4.1 Ý tưởng

```
VẤN ĐỀ CŨ
─────────
Khi dịch câu dài, model cũ phải nhớ toàn bộ câu trong một vector.
Thông tin bị mất khi câu quá dài.

Ví dụ dịch: "Con mèo màu đen đang ngủ trên ghế"

Model cũ:
[Toàn bộ câu] → [1 vector 256 chiều] → [Dịch]
                     ↑
              Thông tin bị nén, mất chi tiết


GIẢI PHÁP: ATTENTION
────────────────────
Khi dịch từng từ, model "nhìn lại" toàn bộ câu gốc
và CHÚ Ý đến các từ liên quan nhất.

Khi dịch "cat":
• Chú ý nhiều đến "mèo" (0.8)
• Chú ý ít đến "đang" (0.05)
• Chú ý ít đến "ghế" (0.1)
```

### 4.2 Self-Attention

```
SELF-ATTENTION = Chú ý đến chính mình
─────────────────────────────────────

Câu: "Con mèo không cắn vì nó hiền"

Khi xử lý từ "nó":
• Model cần hiểu "nó" ám chỉ "mèo"
• Self-attention giúp "nó" chú ý đến "mèo"

Trọng số attention của "nó":
• "Con" : 0.05
• "mèo" : 0.60  ← Chú ý nhiều nhất
• "không": 0.05
• "cắn" : 0.10
• "vì"  : 0.05
• "nó"  : 0.10
• "hiền": 0.05
```

### 4.3 Công thức Attention

```
BƯỚC 1: Tạo Query, Key, Value
─────────────────────────────
• Query (Q) = "Tôi đang tìm gì?"
• Key (K)   = "Tôi có thông tin gì?"
• Value (V) = "Thông tin thực sự của tôi"

Công thức:
Q = X × W_Q
K = X × W_K
V = X × W_V


BƯỚC 2: Tính điểm tương đồng
────────────────────────────
Score = Q × K^T

Ý nghĩa: Điểm cao = Query và Key khớp nhau


BƯỚC 3: Chia tỷ lệ (Scaling)
────────────────────────────
Score_scaled = Score ÷ căn(d_k)

Trong đó d_k = 64 (số chiều của Key)


BƯỚC 4: Softmax
───────────────
Weights = softmax(Score_scaled)

Chuyển điểm thành xác suất (tổng = 1)


BƯỚC 5: Tính Output
───────────────────
Output = Weights × V

Lấy tổng có trọng số của Values


CÔNG THỨC TỔNG HỢP:
───────────────────
Attention(Q, K, V) = softmax((Q × K^T) ÷ căn(d_k)) × V
```

---

## 5. TRANSFORMER ARCHITECTURE

### 5.1 Lịch sử

```
TRƯỚC TRANSFORMER (2017)
─────────────────────────

RNN (Recurrent Neural Network):
• Xử lý tuần tự từng từ một
• Chậm, không thể song song hóa
• Khó nhớ thông tin xa

      x1 → [RNN] → h1
                    ↓
      x2 → [RNN] → h2
                    ↓
      x3 → [RNN] → h3  (thông tin x1 có thể bị mất)


SAU TRANSFORMER (2017 - nay)
─────────────────────────────

Transformer:
• Xử lý SONG SONG tất cả từ cùng lúc
• Nhanh hơn RNN rất nhiều
• Self-attention giúp nhớ mọi thứ

      x1 ─┬─→ [Attention] ─→ h1
      x2 ─┼─→ [Attention] ─→ h2
      x3 ─┴─→ [Attention] ─→ h3
              (xử lý đồng thời)
```

### 5.2 Kiến trúc Transformer

```
TRANSFORMER GỐC (cho dịch máy)
──────────────────────────────

┌─────────────────────────────────────────────────────────┐
│                     TRANSFORMER                          │
│                                                          │
│  ┌────────────────┐         ┌────────────────┐          │
│  │    ENCODER     │────────→│    DECODER     │          │
│  │                │         │                │          │
│  │ "I love cats"  │         │ "Tôi yêu mèo"  │          │
│  │                │         │                │          │
│  └────────────────┘         └────────────────┘          │
│                                                          │
│  Encoder: Đọc hiểu        Decoder: Tạo output           │
│           câu gốc                  từng từ              │
└─────────────────────────────────────────────────────────┘


BERT/PhoBERT (chỉ dùng Encoder)
───────────────────────────────

┌─────────────────────────────────────────────────────────┐
│                    BERT / PhoBERT                        │
│                                                          │
│         ┌────────────────────────┐                       │
│         │       ENCODER          │                       │
│         │                        │                       │
│         │ "Sản phẩm rất tốt"    │                       │
│         │         ↓              │                       │
│         │   [Hiểu ngữ nghĩa]    │                       │
│         │         ↓              │                       │
│         │  Vector đại diện câu   │                       │
│         └────────────────────────┘                       │
│                    ↓                                     │
│         ┌───────────────────┐                            │
│         │  CLASSIFICATION   │                            │
│         │  Positive/Negative│                            │
│         └───────────────────┘                            │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Cấu trúc một lớp Transformer

```
                 Input
                   │
                   ▼
         ┌─────────────────┐
         │ Multi-Head      │
         │ Self-Attention  │
         └────────┬────────┘
                  │
         ┌───────►│◄───────┐  (Residual Connection)
         │        ▼        │
         │ ┌─────────────┐ │
         │ │ Layer Norm  │ │
         │ └──────┬──────┘ │
         │        │        │
         └────────┼────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Feed-Forward   │
         │     Network     │
         └────────┬────────┘
                  │
         ┌───────►│◄───────┐  (Residual Connection)
         │        ▼        │
         │ ┌─────────────┐ │
         │ │ Layer Norm  │ │
         │ └──────┬──────┘ │
         │        │        │
         └────────┼────────┘
                  │
                  ▼
                Output
```

---

## 6. BERT (Bidirectional Encoder Representations from Transformers)

### 6.1 BERT là gì?

```
BERT = Bidirectional Encoder Representations from Transformers

Giải thích từng phần:
• Bidirectional: Đọc cả hai chiều (trái→phải VÀ phải→trái)
• Encoder: Chỉ dùng phần Encoder của Transformer
• Representations: Tạo biểu diễn (vector) cho văn bản
• Transformers: Dựa trên kiến trúc Transformer


SO SÁNH VỚI CÁC MODEL TRƯỚC
────────────────────────────

GPT (chỉ đọc trái→phải):
"Tôi yêu [MASK]" → Model chỉ thấy "Tôi yêu"

ELMo (kết hợp 2 chiều riêng biệt):
Trái→phải: "Tôi yêu" → vector_1
Phải→trái: "[MASK]" → vector_2
Kết hợp: vector_1 + vector_2

BERT (đọc cả 2 chiều ĐỒNG THỜI):
"Tôi yêu [MASK] của mình"
         ↑
Model thấy CẢ "Tôi yêu" VÀ "của mình" → hiểu ngữ cảnh tốt hơn
```

### 6.2 Pre-training Tasks (Nhiệm vụ huấn luyện trước)

```
BERT được huấn luyện với 2 nhiệm vụ:

1. MASKED LANGUAGE MODEL (MLM)
   ────────────────────────────
   Che 15% các từ và yêu cầu model đoán

   Input:  "Tôi [MASK] ăn phở rất ngon"
   Output: Model đoán [MASK] = "thích"

   Mục đích: Học ngữ nghĩa của từ trong ngữ cảnh


2. NEXT SENTENCE PREDICTION (NSP)
   ────────────────────────────────
   Cho 2 câu, hỏi câu B có theo sau câu A không

   Câu A: "Tôi đói bụng"
   Câu B: "Tôi đi ăn cơm"
   → Đúng (IsNext)

   Câu A: "Tôi đói bụng"
   Câu B: "Hôm nay trời đẹp"
   → Sai (NotNext)

   Mục đích: Học quan hệ giữa các câu
```

### 6.3 Fine-tuning (Tinh chỉnh)

```
PRE-TRAINING vs FINE-TUNING
────────────────────────────

PRE-TRAINING (Huấn luyện trước):
• Dữ liệu: Hàng tỷ từ từ Wikipedia, sách, web
• Nhiệm vụ: MLM + NSP
• Thời gian: Nhiều ngày trên nhiều GPU
• Ai làm: Google, VinAI (cho PhoBERT)
• Kết quả: Model hiểu ngôn ngữ chung

FINE-TUNING (Tinh chỉnh):
• Dữ liệu: Dataset cụ thể (ví dụ: 10,000 bình luận có nhãn)
• Nhiệm vụ: Phân loại cảm xúc
• Thời gian: Vài giờ trên 1 GPU
• Ai làm: Bạn
• Kết quả: Model chuyên biệt cho bài toán của bạn


QUÁ TRÌNH FINE-TUNING:
──────────────────────

1. Lấy PhoBERT pre-trained
   ↓
2. Thêm lớp Classification lên trên
   ↓
3. Huấn luyện trên dữ liệu phân loại cảm xúc
   ↓
4. Model học cách phân loại cảm xúc

   ┌─────────────────────────────────────┐
   │        PHOBERT (đã pre-trained)     │  ← Giữ nguyên hoặc fine-tune nhẹ
   │    [Hiểu ngôn ngữ tiếng Việt]       │
   └─────────────────┬───────────────────┘
                     │
                     ▼
   ┌─────────────────────────────────────┐
   │      CLASSIFICATION LAYER           │  ← Huấn luyện mới
   │    [Positive/Neutral/Negative]      │
   └─────────────────────────────────────┘
```

---

## 7. PHOBERT - BERT CHO TIẾNG VIỆT

### 7.1 PhoBERT là gì?

```
PhoBERT = BERT được huấn luyện đặc biệt cho TIẾNG VIỆT

Phát triển bởi: VinAI Research (Việt Nam)
Công bố: Năm 2020
Paper: "PhoBERT: Pre-trained language models for Vietnamese"
```

### 7.2 Tại sao cần PhoBERT?

```
VẤN ĐỀ VỚI BERT GỐC (TIẾNG ANH)
────────────────────────────────

1. Không hiểu tiếng Việt
   • BERT: từ điển tiếng Anh
   • "xin chào" → tokens không có nghĩa

2. Tokenization sai
   • BERT: "tuyệt vời" → ["tuy", "##ệt", "v", "##ời"] (sai)
   • PhoBERT: "tuyệt vời" → ["tuyệt", "vời"] (đúng)

3. Không hiểu đặc trưng tiếng Việt
   • Thanh điệu
   • Từ ghép
   • Cú pháp


PHOBERT GIẢI QUYẾT
──────────────────

1. Huấn luyện trên 20GB dữ liệu tiếng Việt
   • Báo VnExpress, Dân Trí, VNEconomy...
   • Wikipedia tiếng Việt
   
2. Sử dụng pyvi và RDRSegmenter cho word segmentation
   • "học sinh" → 1 token (không phải 2)
   
3. Từ điển ~64,000 tokens tiếng Việt
```

### 7.3 Hai phiên bản PhoBERT

| Phiên bản | Layers | Hidden | Heads | Parameters |
|:----------|:------:|:------:|:-----:|:----------:|
| PhoBERT-base | 12 | 768 | 12 | 135M |
| PhoBERT-large | 24 | 1024 | 16 | 370M |

```
Project của bạn sử dụng: PhoBERT-base (12 layers)
```

---

# PHẦN B: QUY TRÌNH XỬ LÝ CHI TIẾT

---

## 8. TIỀN XỬ LÝ VĂN BẢN

### 8.1 Lý thuyết

```
TẠI SAO CẦN TIỀN XỬ LÝ?
───────────────────────

Văn bản thực tế rất "bẩn":
• CHỮ HOA, chữ thường lẫn lộn
• URL, email, @mentions
• Emoji 👍😊🔥
• Ký tự đặc biệt !!!###
• Khoảng trắng    thừa

Model học tốt hơn với dữ liệu sạch và nhất quán.
```

### 8.2 Các bước xử lý

```
BƯỚC 1: LOWERCASE (Chữ thường)
──────────────────────────────
Input:  "SẢN PHẨM TỐT"
Output: "sản phẩm tốt"

Lý do: "TỐT" và "tốt" nên được xử lý như nhau


BƯỚC 2: XÓA URL
───────────────
Input:  "Xem tại https://example.com"
Output: "Xem tại"

Pattern: http\S+ hoặc www.\S+
Lý do: URL không mang ngữ nghĩa cảm xúc


BƯỚC 3: XÓA KÝ TỰ ĐẶC BIỆT
──────────────────────────
Input:  "Tốt quá!!! @@@"
Output: "Tốt quá"

Giữ lại: Chữ cái, số, khoảng trắng, ký tự tiếng Việt
Lý do: Ký tự đặc biệt không có nghĩa


BƯỚC 4: XÓA KHOẢNG TRẮNG THỪA
─────────────────────────────
Input:  "Sản   phẩm    tốt"
Output: "Sản phẩm tốt"

Lý do: Chuẩn hóa format
```

---

## 9. TOKENIZATION (TÁCH TỪ)

### 9.1 Lý thuyết Tokenization

```
TOKENIZATION = Chia văn bản thành các đơn vị nhỏ (tokens)

VÍ DỤ ĐƠN GIẢN
──────────────
Input:  "Tôi yêu Việt Nam"
Tokens: ["Tôi", "yêu", "Việt", "Nam"]  (4 tokens)


VẤN ĐỀ VỚI WORD-LEVEL TOKENIZATION
───────────────────────────────────
1. Từ điển quá lớn (hàng triệu từ)
2. Không xử lý được từ mới/lỗi chính tả
   • "coooool" → không có trong từ điển


GIẢI PHÁP: SUBWORD TOKENIZATION
────────────────────────────────
Chia từ thành các phần nhỏ hơn (subwords)

Ví dụ:
• "unhappiness" → ["un", "happiness"]
• "playing" → ["play", "ing"]
```

### 9.2 BPE (Byte Pair Encoding)

```
BPE = Thuật toán tách từ được PhoBERT sử dụng

NGUYÊN LÝ:
──────────
1. Bắt đầu với từng ký tự riêng lẻ
2. Tìm cặp ký tự xuất hiện nhiều nhất
3. Gộp cặp đó thành 1 token mới
4. Lặp lại cho đến khi đạt vocab size mong muốn


VÍ DỤ TỪNG BƯỚC:
────────────────

Corpus: ["low", "lowest", "newer", "wider"]

Bước 1: Tách thành ký tự
        ["l", "o", "w", "</w>"]
        ["l", "o", "w", "e", "s", "t", "</w>"]
        ["n", "e", "w", "e", "r", "</w>"]
        ["w", "i", "d", "e", "r", "</w>"]

Bước 2: Đếm cặp phổ biến nhất → ("e", "r") xuất hiện 2 lần
        Gộp: "er"

Bước 3: Tiếp tục với cặp tiếp theo...

Kết quả cuối cùng:
• "lowest" → ["low", "est"]
• "newer"  → ["new", "er"]


ƯU ĐIỂM CỦA BPE:
────────────────
• Từ điển nhỏ gọn (~30,000-64,000 tokens)
• Xử lý được từ mới bằng cách chia nhỏ
• Cân bằng giữa word-level và character-level
```

### 9.3 Special Tokens

```
CÁC TOKEN ĐẶC BIỆT
──────────────────

Token      │ ID  │ Ý nghĩa
───────────┼─────┼──────────────────────────
<s>        │ 0   │ Bắt đầu câu (Start)
</s>       │ 2   │ Kết thúc câu (End)
<pad>      │ 1   │ Đệm cho câu ngắn
<unk>      │ 3   │ Từ không biết (Unknown)
<mask>     │ -   │ Từ bị che (cho training)


VÍ DỤ:
──────
Input: "Sản phẩm tốt"

Tokens: ["<s>", "sản", "phẩm", "tốt", "</s>"]

Token IDs: [0, 1234, 5678, 9012, 2]
```

---

## 10. EMBEDDING LAYER

### 10.1 Lý thuyết Embedding

```
EMBEDDING = Ánh xạ từ số sang vector

Tại sao cần?
• Token ID (số nguyên) không chứa ngữ nghĩa
• Vector có thể biểu diễn quan hệ phức tạp


EMBEDDING TABLE (Bảng tra cứu)
──────────────────────────────

Token ID    │ Vector (768 chiều)
────────────┼────────────────────────────────
0 (<s>)     │ [0.01, 0.02, -0.01, ...]
1 (<pad>)   │ [0.00, 0.00, 0.00, ...]
2 (</s>)    │ [-0.01, 0.03, 0.02, ...]
...         │ ...
1234 ("sản")│ [0.12, -0.34, 0.56, ...]
5678 ("tốt")│ [0.89, 0.23, 0.67, ...]
...         │ ...

Tổng: ~64,000 hàng × 768 cột = 49 triệu tham số
```

### 10.2 Ba loại Embedding trong BERT

```
CÔNG THỨC TỔNG HỢP:
───────────────────
E = E_token + E_position + E_segment


1. TOKEN EMBEDDING (E_token)
   ──────────────────────────
   • Tra cứu từ bảng embedding theo token ID
   • Mỗi từ → 1 vector 768 chiều
   • Học được trong quá trình training


2. POSITION EMBEDDING (E_position)
   ─────────────────────────────────
   • Mã hóa vị trí của từ trong câu
   • Vị trí 0, 1, 2, ... mỗi vị trí có 1 vector riêng
   • PhoBERT hỗ trợ tối đa 256 vị trí

   Tại sao cần?
   • Transformer xử lý song song → không có khái niệm "thứ tự"
   • Position embedding cho model biết từ nào đứng trước/sau

   Ví dụ:
   • "Chó cắn người" ≠ "Người cắn chó"
   • Cùng 3 từ nhưng nghĩa khác nhau do thứ tự


3. SEGMENT EMBEDDING (E_segment)
   ───────────────────────────────
   • Phân biệt câu A và câu B
   • Dùng cho bài toán 2 câu (QA, NLI)
   • Trong phân loại cảm xúc (1 câu): tất cả = 0


MINH HỌA:
─────────

Tokens: ["<s>", "sản", "phẩm", "tốt", "</s>"]
Vị trí:    0      1       2      3       4

E_token:   [vec0] [vec1]  [vec2] [vec3]  [vec4]
E_position:[pos0] [pos1]  [pos2] [pos3]  [pos4]
E_segment: [seg0] [seg0]  [seg0] [seg0]  [seg0]  (tất cả = 0)
─────────────────────────────────────────────────
E_final:   [sum0] [sum1]  [sum2] [sum3]  [sum4]

Mỗi vec có 768 chiều, cộng element-wise
```

---

## 11. TRANSFORMER LAYER CHI TIẾT

### 11.1 Multi-Head Self-Attention

```
TẠI SAO "MULTI-HEAD"?
─────────────────────

Vấn đề: Một attention head có thể bỏ sót thông tin

Giải pháp: Dùng NHIỀU heads, mỗi head học một khía cạnh

Ví dụ với câu: "Con mèo đen đang ngủ trên ghế"

Head 1: Học quan hệ chủ - vị
        "mèo" attention → "ngủ" (mèo làm gì?)

Head 2: Học quan hệ bổ nghĩa
        "mèo" attention → "đen" (mèo như thế nào?)

Head 3: Học quan hệ vị trí
        "ngủ" attention → "ghế" (ngủ ở đâu?)

...

PhoBERT có 12 heads → học 12 loại quan hệ khác nhau


CẤU TRÚC MULTI-HEAD:
────────────────────

Input X (n × 768)
       │
       ├──→ Head 1: Q1, K1, V1 → Attention1 (n × 64)
       ├──→ Head 2: Q2, K2, V2 → Attention2 (n × 64)
       ├──→ Head 3: Q3, K3, V3 → Attention3 (n × 64)
       │    ...
       └──→ Head 12: Q12, K12, V12 → Attention12 (n × 64)
                           │
                           ▼
                 Concat(head1,...,head12)
                        (n × 768)
                           │
                           ▼
                  Linear(W_O): 768 → 768
                           │
                           ▼
                    Output (n × 768)


CÔNG THỨC:
──────────
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) × W_O

Trong đó:
• head_i = Attention(Q_i, K_i, V_i)
• Q_i = Q × W_Q^i (768 → 64)
• K_i = K × W_K^i (768 → 64)
• V_i = V × W_V^i (768 → 64)
• W_O = Ma trận output (768 × 768)
```

### 11.2 Feed-Forward Network

```
SAU ATTENTION, MỖI TOKEN ĐI QUA FFN
───────────────────────────────────

Cấu trúc:
• Linear 1: 768 → 3072 (mở rộng 4 lần)
• GELU activation
• Linear 2: 3072 → 768 (thu nhỏ về)


CÔNG THỨC:
──────────
FFN(x) = Linear2(GELU(Linear1(x)))
       = (GELU(x × W1 + b1)) × W2 + b2

Trong đó:
• x  = Vector input (768 chiều)
• W1 = Trọng số lớp 1 (768 × 3072)
• b1 = Bias lớp 1 (3072)
• W2 = Trọng số lớp 2 (3072 × 768)
• b2 = Bias lớp 2 (768)


TẠI SAO CẦN FFN?
────────────────
• Attention chỉ tính tổ hợp tuyến tính của các từ
• FFN thêm khả năng học quan hệ PHI TUYẾN
• Giúp model biểu diễn các pattern phức tạp hơn
```

### 11.3 Residual Connection và Layer Normalization

```
RESIDUAL CONNECTION (Skip Connection)
─────────────────────────────────────

Ý tưởng: Cộng input vào output

y = x + F(x)

Trong đó:
• x = Input ban đầu
• F(x) = Output từ sublayer (Attention hoặc FFN)
• y = Output cuối cùng


Tại sao cần?
• Gradient chảy trực tiếp qua đường tắt
• Tránh vanishing gradient trong mạng sâu
• Model có thể "bỏ qua" sublayer nếu cần (F(x) ≈ 0)


LAYER NORMALIZATION
───────────────────

Công thức:
LayerNorm(x) = gamma × ((x - mean) / sqrt(var + eps)) + beta

Trong đó:
• x = Vector input (768 chiều)
• mean = Trung bình của 768 phần tử
• var = Phương sai của 768 phần tử
• eps = 1e-6 (tránh chia 0)
• gamma, beta = Tham số học được


Tại sao cần?
• Chuẩn hóa giữ activation trong khoảng hợp lý
• Training ổn định và nhanh hơn


THỨ TỰ TRONG PHOBERT:
─────────────────────
Input
  │
  └──────────────────┐
  ▼                  │
Attention/FFN        │ (residual)
  │                  │
  ▼                  │
  + ←────────────────┘
  │
  ▼
LayerNorm
  │
  ▼
Output
```

---

## 12. CLASSIFICATION VÀ OUTPUT

### 12.1 Pooler Layer

```
SAU 12 TRANSFORMER LAYERS
─────────────────────────

Output: Ma trận (n × 768) với n = số tokens

Tokens: [<s>, "sản", "phẩm", "tốt", </s>]
            │
            ▼
         [h_0]  ← Vector của token <s>, 768 chiều

Token <s> (CLS) được dùng làm đại diện cho CẢ CÂU

Tại sao?
• Vị trí đầu tiên, attention đến tất cả từ khác
• Được thiết kế để tổng hợp thông tin toàn câu


POOLER LAYER:
─────────────
h_pooled = tanh(h_0 × W_pooler + b_pooler)

Trong đó:
• h_0 = Vector của token <s> (768 chiều)
• W_pooler = Trọng số (768 × 768)
• b_pooler = Bias (768)
• tanh = Hàm kích hoạt, output trong [-1, 1]
```

### 12.2 Classification Head

```
CLASSIFICATION LAYER
────────────────────

logits = h_pooled × W_classifier + b_classifier

Trong đó:
• h_pooled = Vector đại diện câu (768 chiều)
• W_classifier = Trọng số (768 × num_classes)
• b_classifier = Bias (num_classes)
• num_classes = 3 (positive, neutral, negative)


Kết quả:
• logits = [z_pos, z_neu, z_neg] (3 số thực)
• Chưa phải xác suất (có thể âm, tổng ≠ 1)
```

### 12.3 Softmax và Cross-Entropy Loss

```
SOFTMAX
───────

Chuyển logits thành xác suất:

P(class = k) = exp(z_k) / sum(exp(z_j))

Ví dụ:
• logits = [2.5, 0.3, -1.2]
• exp(logits) = [12.18, 1.35, 0.30]
• sum = 13.83
• probs = [0.88, 0.10, 0.02]


CROSS-ENTROPY LOSS (Khi training)
─────────────────────────────────

Loss = -log(P(correct_class))

Ví dụ:
• Label thực: positive (class 0)
• P(positive) = 0.88
• Loss = -log(0.88) = 0.13

Ý nghĩa:
• Loss nhỏ khi P(correct_class) cao
• Loss lớn khi P(correct_class) thấp
• Training tối thiểu hóa Loss → tối đa hóa P(correct_class)
```

---

## 13. KẾT QUẢ VÀ ĐÁNH GIÁ

### 13.1 Metrics đánh giá

```
ACCURACY (Độ chính xác)
───────────────────────

Accuracy = Số dự đoán đúng / Tổng số mẫu

Ví dụ:
• 100 câu test
• Model đoán đúng 85 câu
• Accuracy = 85%


PRECISION, RECALL, F1-SCORE
────────────────────────────

Với mỗi class (ví dụ: positive):

                              True Positive
Precision = ─────────────────────────────────────────
            True Positive + False Positive

            (Trong các câu model đoán positive, bao nhiêu đúng?)


                           True Positive
Recall = ─────────────────────────────────────────
         True Positive + False Negative

         (Trong các câu thực sự positive, model tìm được bao nhiêu?)


              2 × Precision × Recall
F1-Score = ──────────────────────────
            Precision + Recall

           (Trung bình điều hòa của Precision và Recall)
```

### 13.2 Confusion Matrix

```
MA TRẬN NHẦM LẪN
─────────────────

                    Predicted
                 POS   NEU   NEG
              ┌──────┬──────┬──────┐
    POS       │  85  │  10  │   5  │
Actual  NEU   │   8  │  82  │  10  │
    NEG       │   5  │  12  │  83  │
              └──────┴──────┴──────┘

Đường chéo = Dự đoán đúng
Ngoài đường chéo = Dự đoán sai

Ví dụ: Model nhầm 10 câu Positive thành Neutral
```

---

## 14. TÓM TẮT TOÀN BỘ CÔNG THỨC

### Bảng công thức

| # | Tên | Công thức | Ghi chú |
|:-:|:----|:----------|:--------|
| 1 | Neuron | y = f(Σw_i×x_i + b) | Đơn vị cơ bản |
| 2 | Sigmoid | f(x) = 1/(1+e^(-x)) | Output 0-1 |
| 3 | ReLU | f(x) = max(0, x) | Output ≥ 0 |
| 4 | GELU | f(x) ≈ 0.5x(1+tanh(0.8x+0.04x³)) | Dùng trong BERT |
| 5 | Softmax | P(k) = e^(z_k) / Σe^(z_j) | Xác suất |
| 6 | Embedding | E = E_token + E_pos + E_seg | Nhúng từ |
| 7 | Attention | Att = softmax(QK^T/√d) × V | Cơ chế chú ý |
| 8 | Multi-Head | MH = Concat(heads) × W_O | 12 heads |
| 9 | FFN | FFN = GELU(xW1+b1)W2+b2 | Phi tuyến |
| 10 | LayerNorm | LN = γ(x-μ)/σ + β | Chuẩn hóa |
| 11 | Residual | y = x + F(x) | Kết nối tắt |
| 12 | Classification | logits = h × W + b | Phân loại |
| 13 | Cross-Entropy | L = -log(P_correct) | Loss |

---

## 🔗 THAM KHẢO

- [Attention Is All You Need (2017)](https://arxiv.org/abs/1706.03762) - Paper gốc Transformer
- [BERT: Pre-training of Deep Bidirectional Transformers (2018)](https://arxiv.org/abs/1810.04805) - Paper BERT
- [PhoBERT: Pre-trained language models for Vietnamese (2020)](https://arxiv.org/abs/2003.00744) - Paper PhoBERT
- Code: [sentiment_analyzer.py](file:///d:/LVTN/LVTN2025/sentiment-analysis-system/backend/src/services/sentiment_analyzer.py)
