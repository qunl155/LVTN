# 📊 NỘI DUNG THUYẾT TRÌNH BẢO VỆ LUẬN VĂN TỐT NGHIỆP

## ĐỀ TÀI: HỆ THỐNG PHÂN TÍCH CẢM XÚC TRÊN MẠNG XÃ HỘI SỬ DỤNG MÔ HÌNH PHOBERT

---

## 📋 CẤU TRÚC BÀI THUYẾT TRÌNH

| Phần | Nội dung | Thời gian |
|:----:|:---------|:---------:|
| 1 | Giới thiệu đề tài | 2 phút |
| 2 | Lý do chọn đề tài | 2 phút |
| 3 | Cơ sở lý thuyết | 4 phút |
| 4 | Thiết kế hệ thống | 4 phút |
| 5 | Mô hình PhoBERT | 4 phút |
| 6 | Kết quả thực nghiệm | 3 phút |
| 7 | Demo hệ thống | 3 phút |
| 8 | Kết luận & Hướng phát triển | 2 phút |
| | **Tổng cộng** | **~25 phút** |

---

# PHẦN 1: GIỚI THIỆU ĐỀ TÀI

## Slide 1: Trang bìa

```
HỆ THỐNG PHÂN TÍCH CẢM XÚC TRÊN MẠNG XÃ HỘI
SỬ DỤNG MÔ HÌNH PHOBERT

Sinh viên thực hiện: [Họ tên]
MSSV: [Mã số sinh viên]
Giảng viên hướng dẫn: [Họ tên GVHD]

[Tên trường]
[Năm 2025]
```

## Slide 2: Tổng quan đề tài

**Script thuyết trình:**

> "Kính thưa Hội đồng, em xin trình bày đề tài 'Hệ thống phân tích cảm xúc trên mạng xã hội sử dụng mô hình PhoBERT'.
>
> Đề tài này xây dựng một hệ thống web có khả năng phân tích cảm xúc từ các bình luận tiếng Việt trên mạng xã hội, phân loại thành 3 nhóm: Tích cực, Tiêu cực và Trung tính.
>
> Hệ thống sử dụng mô hình học sâu PhoBERT - một mô hình ngôn ngữ được huấn luyện đặc biệt cho tiếng Việt bởi VinAI Research."

**Nội dung slide:**
- Phân tích cảm xúc (Sentiment Analysis) từ bình luận tiếng Việt
- 3 nhãn phân loại: Tích cực 😊 | Trung tính 😐 | Tiêu cực 😟
- Mô hình: PhoBERT (Vietnamese BERT)
- Ứng dụng: Đánh giá sản phẩm, theo dõi thương hiệu, phân tích dư luận

---

# PHẦN 2: LÝ DO CHỌN ĐỀ TÀI

## Slide 3: Bối cảnh thực tiễn

**Script thuyết trình:**

> "Lý do em chọn đề tài này xuất phát từ thực tiễn:
>
> Thứ nhất, mạng xã hội đang bùng nổ tại Việt Nam với hơn 70 triệu người dùng. Mỗi ngày có hàng triệu bình luận được đăng tải trên Facebook, YouTube, TikTok...
>
> Thứ hai, doanh nghiệp cần hiểu phản hồi của khách hàng để cải thiện sản phẩm và dịch vụ. Việc đọc thủ công hàng nghìn bình luận là không khả thi.
>
> Thứ ba, tiếng Việt có đặc thù riêng khiến các công cụ phân tích tiếng Anh không áp dụng được trực tiếp."

**Nội dung slide:**

| Vấn đề | Số liệu |
|:-------|:--------|
| Người dùng MXH tại VN | 70+ triệu |
| Bình luận mỗi ngày | Hàng triệu |
| Thời gian đọc thủ công | Không khả thi |
| Độ chính xác công cụ tiếng Anh cho tiếng Việt | Thấp |

## Slide 4: Mục tiêu đề tài

**Script thuyết trình:**

> "Từ thực tiễn đó, em đặt ra các mục tiêu sau cho đề tài:
>
> Một là, xây dựng mô hình phân tích cảm xúc chính xác cho tiếng Việt sử dụng PhoBERT.
>
> Hai là, phát triển hệ thống web hoàn chỉnh cho phép người dùng nhập bình luận hoặc nhập URL để phân tích.
>
> Ba là, cung cấp biểu đồ trực quan và đề xuất hữu ích cho người dùng."

**Nội dung slide:**
1. ✅ Xây dựng mô hình phân tích cảm xúc tiếng Việt với độ chính xác cao
2. ✅ Phát triển hệ thống web đầy đủ (Frontend + Backend + Database)
3. ✅ Hỗ trợ phân tích từ URL YouTube
4. ✅ Phát hiện nội dung nhạy cảm (bạo lực, chính trị)
5. ✅ Trực quan hóa kết quả bằng biểu đồ

---

# PHẦN 3: CƠ SỞ LÝ THUYẾT

## Slide 5: Xử lý ngôn ngữ tự nhiên (NLP)

**Script thuyết trình:**

> "Về cơ sở lý thuyết, đề tài dựa trên nền tảng Xử lý ngôn ngữ tự nhiên hay NLP.
>
> NLP là nhánh của trí tuệ nhân tạo giúp máy tính hiểu và xử lý ngôn ngữ của con người.
>
> Phân tích cảm xúc là một bài toán phân loại văn bản, trong đó đầu vào là một câu văn bản và đầu ra là nhãn cảm xúc tương ứng."

**Nội dung slide:**
```
NLP (Natural Language Processing) = Xử lý ngôn ngữ tự nhiên

Các bài toán NLP phổ biến:
├── Phân loại văn bản (Text Classification)
├── Phân tích cảm xúc (Sentiment Analysis) ← ĐỀ TÀI
├── Nhận dạng thực thể (NER)
├── Dịch máy (Machine Translation)
└── Hỏi đáp (Question Answering)
```

## Slide 6: Mô hình Transformer

**Script thuyết trình:**

> "Về mặt kỹ thuật, hệ thống sử dụng kiến trúc Transformer - một đột phá trong lĩnh vực NLP từ năm 2017.
>
> Transformer sử dụng cơ chế Self-Attention cho phép mô hình hiểu mối quan hệ giữa các từ trong câu.
>
> Ví dụ, với câu 'Sản phẩm này không tốt', mô hình cần hiểu từ 'không' bổ nghĩa cho 'tốt' để kết luận câu này mang ý nghĩa tiêu cực."

**Nội dung slide:**
```
TRANSFORMER (2017)

Ưu điểm so với mô hình cũ (RNN, LSTM):
✅ Xử lý song song → Nhanh hơn
✅ Self-Attention → Hiểu ngữ cảnh tốt hơn
✅ Không bị mất thông tin với câu dài
```

## Slide 7: BERT và PhoBERT

**Script thuyết trình:**

> "BERT là mô hình được Google phát triển năm 2018, sử dụng kiến trúc Transformer để hiểu ngôn ngữ theo hai chiều.
>
> Tuy nhiên, BERT được huấn luyện cho tiếng Anh nên không hiệu quả với tiếng Việt.
>
> PhoBERT được VinAI Research phát triển năm 2020, huấn luyện trên 20GB dữ liệu tiếng Việt từ báo điện tử và Wikipedia tiếng Việt. Đây là mô hình tiên tiến nhất cho xử lý tiếng Việt hiện nay."

**Nội dung slide:**

| Đặc điểm | BERT (Google) | PhoBERT (VinAI) |
|:---------|:--------------|:----------------|
| Ngôn ngữ | Tiếng Anh | **Tiếng Việt** |
| Dữ liệu huấn luyện | 16GB tiếng Anh | **20GB tiếng Việt** |
| Số lớp (layers) | 12 | **12** |
| Hidden size | 768 | **768** |
| Số tham số | 110M | **135M** |

---

# PHẦN 4: THIẾT KẾ HỆ THỐNG

## Slide 8: Kiến trúc tổng quan

**Script thuyết trình:**

> "Về thiết kế, hệ thống được xây dựng theo kiến trúc 3 tầng:
>
> Tầng 1 là Frontend sử dụng React.js, cung cấp giao diện web cho người dùng nhập liệu và xem kết quả.
>
> Tầng 2 là Backend sử dụng FastAPI - một framework Python hiện đại, tích hợp mô hình PhoBERT để phân tích.
>
> Tầng 3 là Database MongoDB lưu trữ lịch sử phân tích."

**Nội dung slide:**
```
┌─────────────────────────────────────────────────────────────┐
│                      NGƯỜI DÙNG                              │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                      │
│  • Giao diện nhập liệu                                      │
│  • Biểu đồ trực quan (Chart.js)                             │
│  • Responsive design                                        │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                        │
│  • API endpoints                                            │
│  • Mô hình PhoBERT                                          │
│  • Xử lý dữ liệu                                            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                       │
│  • Lưu lịch sử phân tích                                    │
└─────────────────────────────────────────────────────────────┘
```

## Slide 9: Công nghệ sử dụng

**Script thuyết trình:**

> "Các công nghệ chính được sử dụng trong hệ thống bao gồm:
>
> Frontend: React.js cho giao diện, Chart.js cho biểu đồ.
>
> Backend: FastAPI - framework Python nhanh và hiện đại, PyTorch và Transformers để chạy mô hình PhoBERT.
>
> Database: MongoDB - cơ sở dữ liệu NoSQL linh hoạt.
>
> Deployment: Docker để đóng gói và triển khai hệ thống."

**Nội dung slide:**

| Thành phần | Công nghệ | Phiên bản |
|:-----------|:----------|:---------:|
| Frontend | React.js | 18+ |
| Backend | FastAPI (Python) | 3.11+ |
| AI Model | PyTorch + Transformers | - |
| Database | MongoDB | 7.0+ |
| Deployment | Docker | - |

## Slide 10: Luồng xử lý chính

**Script thuyết trình:**

> "Luồng xử lý chính của hệ thống như sau:
>
> Bước 1: Người dùng nhập bình luận hoặc URL qua giao diện web.
>
> Bước 2: Frontend gửi request đến Backend thông qua REST API.
>
> Bước 3: Backend tiền xử lý văn bản, bao gồm chuyển chữ thường, xóa URL và ký tự đặc biệt.
>
> Bước 4: Văn bản được tokenize và đưa qua mô hình PhoBERT.
>
> Bước 5: Model trả về xác suất cho 3 nhãn, hệ thống chọn nhãn có xác suất cao nhất.
>
> Bước 6: Kết quả được trả về Frontend và hiển thị cho người dùng."

**Nội dung slide:**
```
[Người dùng nhập bình luận]
         │
         ▼
[Tiền xử lý văn bản]
• Chữ thường
• Xóa URL, ký tự đặc biệt
         │
         ▼
[Tokenization (BPE)]
• Tách từ thành tokens
• Chuyển thành token IDs
         │
         ▼
[PhoBERT Model]
• 12 Transformer layers
• Classification head
         │
         ▼
[Softmax]
• Tính xác suất cho 3 nhãn
• Chọn nhãn cao nhất
         │
         ▼
[Kết quả: POSITIVE/NEUTRAL/NEGATIVE + Độ tin cậy]
```

---

# PHẦN 5: MÔ HÌNH PHOBERT

## Slide 11: Kiến trúc PhoBERT

**Script thuyết trình:**

> "Đi sâu vào mô hình PhoBERT, kiến trúc bao gồm:
>
> Lớp Embedding chuyển đổi token thành vector 768 chiều, kết hợp cả embedding của từ và vị trí.
>
> 12 lớp Transformer, mỗi lớp gồm Multi-Head Self-Attention và Feed-Forward Network.
>
> Cuối cùng là lớp Classification để phân loại thành 3 nhãn cảm xúc."

**Nội dung slide:**
```
INPUT: "Sản phẩm rất tốt"
         │
         ▼
┌─────────────────────────────────┐
│      EMBEDDING LAYER            │
│  Token + Position + Segment     │
│  Output: (n × 768)              │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│      12 × TRANSFORMER LAYER     │
│  • Multi-Head Attention (12 heads)
│  • Feed-Forward Network         │
│  • Layer Normalization          │
└─────────────────┬───────────────┘
                  │
                  ▼
┌─────────────────────────────────┐
│      CLASSIFICATION HEAD        │
│  768 → 3 (pos, neu, neg)        │
└─────────────────┬───────────────┘
                  │
                  ▼
OUTPUT: [0.92, 0.05, 0.03] → POSITIVE (92%)
```

## Slide 12: Cơ chế Self-Attention

**Script thuyết trình:**

> "Điểm mạnh của PhoBERT nằm ở cơ chế Self-Attention.
>
> Self-Attention cho phép mỗi từ 'nhìn' vào tất cả các từ khác trong câu để hiểu ngữ cảnh.
>
> Ví dụ với câu 'Sản phẩm này không tốt', từ 'tốt' sẽ chú ý nhiều đến từ 'không' và hiểu rằng ý nghĩa đã bị đảo ngược."

**Nội dung slide:**
```
Câu: "Sản phẩm không tốt"

Ma trận Attention:
              Sản   phẩm  không  tốt
Sản         [0.4   0.3   0.2   0.1]
phẩm        [0.3   0.4   0.2   0.1]
không       [0.1   0.2   0.3   0.4] ← "không" chú ý đến "tốt"
tốt         [0.1   0.2   0.5   0.2] ← "tốt" chú ý đến "không"

→ Mô hình hiểu "không tốt" = TIÊU CỰC
```

## Slide 13: Công thức Softmax

**Script thuyết trình:**

> "Sau khi qua PhoBERT, hàm Softmax được sử dụng để chuyển đổi điểm số thành xác suất.
>
> Công thức Softmax đảm bảo tổng xác suất của 3 nhãn bằng 100%.
>
> Nhãn có xác suất cao nhất được chọn làm kết quả cuối cùng, và xác suất đó là độ tin cậy của dự đoán."

**Nội dung slide:**
```
CÔNG THỨC SOFTMAX:

P(class = k) = exp(z_k) / Σ exp(z_j)

Trong đó:
• z_k = điểm số (logit) của lớp k
• exp = hàm mũ cơ số e

VÍ DỤ:
logits = [2.5, 0.3, -1.2]

exp(2.5) = 12.18
exp(0.3) = 1.35
exp(-1.2) = 0.30
Tổng = 13.83

P(positive) = 12.18/13.83 = 88%
P(neutral)  = 1.35/13.83  = 10%
P(negative) = 0.30/13.83  = 2%

→ Kết quả: POSITIVE với độ tin cậy 88%
```

---

# PHẦN 6: KẾT QUẢ THỰC NGHIỆM

## Slide 14: Dữ liệu huấn luyện

**Script thuyết trình:**

> "Về quá trình huấn luyện, em đã sử dụng tập dữ liệu bình luận tiếng Việt được chia thành 3 phần:
>
> Tập Train để huấn luyện mô hình.
> Tập Validation để điều chỉnh siêu tham số.
> Tập Test để đánh giá cuối cùng."

**Nội dung slide:**

| Tập dữ liệu | Số lượng | Mục đích |
|:------------|:--------:|:---------|
| Train | [Số mẫu] | Huấn luyện mô hình |
| Validation | [Số mẫu] | Điều chỉnh hyperparameters |
| Test | [Số mẫu] | Đánh giá cuối cùng |

## Slide 15: Các độ đo đánh giá

**Script thuyết trình:**

> "Để đánh giá mô hình, em sử dụng 4 độ đo phổ biến:
>
> Accuracy đo tỷ lệ dự đoán đúng trên tổng số mẫu.
>
> Precision đo trong các mẫu được dự đoán là positive, bao nhiêu phần trăm thực sự là positive.
>
> Recall đo trong các mẫu thực sự positive, mô hình tìm được bao nhiêu phần trăm.
>
> F1-Score là trung bình điều hòa của Precision và Recall."

**Nội dung slide:**
```
CÁC ĐỘ ĐO ĐÁNH GIÁ:

                    Số dự đoán đúng
Accuracy    = ─────────────────────────
                  Tổng số mẫu


                       True Positive
Precision   = ─────────────────────────────────
              True Positive + False Positive


                       True Positive
Recall      = ─────────────────────────────────
              True Positive + False Negative


                2 × Precision × Recall
F1-Score    = ───────────────────────────
                Precision + Recall
```

## Slide 16: Kết quả đạt được

**Script thuyết trình:**

> "Kết quả huấn luyện mô hình cho thấy:
>
> [Nêu các số liệu cụ thể về Accuracy, F1-Score...]
>
> Mô hình đạt kết quả tốt trên tập test, cho thấy khả năng tổng quát hóa cao."

**Nội dung slide:**

| Độ đo | Kết quả |
|:------|:-------:|
| Accuracy | [XX]% |
| Precision | [XX]% |
| Recall | [XX]% |
| F1-Score | [XX]% |

*[Thêm biểu đồ training loss nếu có]*

---

# PHẦN 7: DEMO HỆ THỐNG

## Slide 17: Giao diện hệ thống

**Script thuyết trình:**

> "Em xin demo hệ thống đã xây dựng.
>
> Đây là giao diện chính với hai tab: Nhập bình luận thủ công và Phân tích từ URL.
>
> Người dùng có thể nhập một hoặc nhiều bình luận, mỗi dòng một bình luận, sau đó nhấn nút Phân tích."

## Slide 18: Demo phân tích

**Script thuyết trình:**

> "Khi nhấn phân tích, hệ thống sẽ:
>
> 1. Phân loại cảm xúc cho từng bình luận với độ tin cậy.
> 2. Hiển thị biểu đồ tròn thống kê tỷ lệ các loại cảm xúc.
> 3. Phát hiện nội dung nhạy cảm nếu có.
> 4. Đưa ra đề xuất nên hay không nên xem nội dung."

*[Demo trực tiếp trên hệ thống]*

---

# PHẦN 8: KẾT LUẬN

## Slide 19: Kết quả đạt được

**Script thuyết trình:**

> "Tóm lại, đề tài đã hoàn thành các mục tiêu đề ra:
>
> Một là, đã xây dựng và fine-tune thành công mô hình PhoBERT cho bài toán phân tích cảm xúc tiếng Việt.
>
> Hai là, đã phát triển hệ thống web hoàn chỉnh với đầy đủ các tính năng.
>
> Ba là, mô hình đạt độ chính xác [XX]% trên tập test."

**Nội dung slide:**
- ✅ Fine-tune PhoBERT cho phân tích cảm xúc tiếng Việt
- ✅ Phát triển hệ thống web hoàn chỉnh (React + FastAPI + MongoDB)
- ✅ Hỗ trợ phân tích từ URL YouTube
- ✅ Phát hiện nội dung nhạy cảm
- ✅ Độ chính xác: [XX]%

## Slide 20: Hạn chế

**Script thuyết trình:**

> "Bên cạnh kết quả đạt được, đề tài còn một số hạn chế:
>
> Một là, phát hiện nội dung nhạy cảm hiện dùng phương pháp keyword matching đơn giản, có thể có false positive.
>
> Hai là, chưa hỗ trợ nhiều nền tảng mạng xã hội như Facebook, TikTok.
>
> Ba là, chưa xử lý được tiếng lóng, viết tắt của giới trẻ."

**Nội dung slide:**
- ⚠️ Phát hiện nội dung nhạy cảm còn dựa trên keyword
- ⚠️ Chưa hỗ trợ Facebook, TikTok
- ⚠️ Khó xử lý tiếng lóng, viết tắt ("okela", "nc", "đc")
- ⚠️ Cần thêm dữ liệu huấn luyện đa dạng hơn

## Slide 21: Hướng phát triển

**Script thuyết trình:**

> "Trong tương lai, đề tài có thể phát triển theo các hướng:
>
> Một là, tích hợp thêm các nền tảng mạng xã hội khác.
>
> Hai là, sử dụng mô hình AI để phát hiện nội dung nhạy cảm thay vì keyword.
>
> Ba là, phát triển thêm tính năng phân tích theo thời gian thực."

**Nội dung slide:**
- 🚀 Tích hợp Facebook, TikTok, Twitter
- 🚀 Dùng AI cho phát hiện nội dung nhạy cảm
- 🚀 Phân tích real-time (streaming)
- 🚀 Dashboard cho doanh nghiệp
- 🚀 Mobile app

## Slide 22: Lời cảm ơn

**Script thuyết trình:**

> "Em xin chân thành cảm ơn:
>
> Thầy/Cô [Tên GVHD] đã tận tình hướng dẫn em trong suốt quá trình thực hiện đề tài.
>
> Quý Thầy Cô trong Hội đồng đã dành thời gian lắng nghe bài thuyết trình của em.
>
> Em xin hết. Kính mời Hội đồng đặt câu hỏi."

**Nội dung slide:**
```
CẢM ƠN QUÝ THẦY CÔ ĐÃ LẮNG NGHE!

Sinh viên: [Họ tên]
Email: [Email]
GitHub: [Link repo]

Q&A
```

---

# PHỤ LỤC: CÂU HỎI THƯỜNG GẶP

## Câu hỏi 1: Tại sao chọn PhoBERT mà không dùng BERT gốc?

> "Dạ thưa Thầy/Cô, em chọn PhoBERT vì:
>
> Thứ nhất, BERT gốc được huấn luyện trên tiếng Anh nên không hiểu tiếng Việt tốt.
>
> Thứ hai, PhoBERT được huấn luyện trên 20GB dữ liệu tiếng Việt nên hiểu đặc trưng ngôn ngữ Việt như thanh điệu, từ ghép.
>
> Thứ ba, các nghiên cứu cho thấy PhoBERT đạt state-of-the-art trên nhiều tác vụ NLP tiếng Việt."

## Câu hỏi 2: Tại sao dùng 12 layers?

> "Dạ thưa Thầy/Cô, 12 layers là thiết kế của BERT-base được Google tìm ra qua thực nghiệm, cân bằng giữa:
>
> Hiệu suất: Đủ sâu để học ngữ nghĩa phức tạp.
> Tốc độ: Không quá chậm để triển khai thực tế.
> Tài nguyên: Chạy được trên GPU thông thường.
>
> So với BERT-large 24 layers, BERT-base chỉ giảm 1-2% accuracy nhưng nhanh gấp đôi."

## Câu hỏi 3: Làm sao xử lý câu phủ định kép?

> "Dạ thưa Thầy/Cô, cơ chế Self-Attention của PhoBERT có thể xử lý phủ định kép.
>
> Ví dụ câu 'Sản phẩm không phải là không tốt', các từ 'không' sẽ attention với nhau và mô hình hiểu nghĩa cuối cùng là tích cực.
>
> Tuy nhiên, với các câu phức tạp hơn, mô hình có thể cần thêm dữ liệu huấn luyện để cải thiện."

## Câu hỏi 4: Độ tin cậy (confidence) có ý nghĩa gì?

> "Dạ thưa Thầy/Cô, độ tin cậy là xác suất cao nhất mà mô hình gán cho nhãn dự đoán.
>
> Ví dụ, confidence 95% nghĩa là mô hình rất chắc chắn về dự đoán.
> Confidence 60% nghĩa là mô hình chưa chắc chắn lắm, có thể cần xem xét lại.
>
> Trong hệ thống, em hiển thị độ tin cậy để người dùng có thể đánh giá độ đáng tin của kết quả."

---

*Chúc bạn bảo vệ luận văn thành công! 🎓*
