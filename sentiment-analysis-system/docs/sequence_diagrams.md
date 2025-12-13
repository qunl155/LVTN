# SO DO TUAN TU - HE THONG PHAN TICH CAM XUC

## 1. SO DO PHAN TICH TU VAN BAN

Copy code ben duoi vao https://mermaid.live/

```
sequenceDiagram
    autonumber
    participant User as User
    participant FE as Frontend React
    participant API as Backend FastAPI
    participant DP as DataProcessor
    participant SA as SentimentAnalyzer
    participant DB as MongoDB

    User->>FE: Enter comments
    User->>FE: Click Analyze button
    FE->>FE: Split comments by line
    FE->>FE: Filter empty comments
    FE->>API: POST /api/v1/analyze
    Note over API: Validate input
    API->>DP: process_comments
    DP->>DP: Clean comments
    DP-->>API: cleaned_comments
    loop Each comment
        API->>SA: analyze_comment
        SA->>SA: preprocess_text
        SA->>SA: detect_content_type
        SA->>SA: predict_sentiment_ml
        Note over SA: PhoBERT Model
        SA-->>API: CommentAnalysis
    end
    API->>API: Calculate statistics
    API->>API: Generate warnings
    API->>DB: save_analysis
    DB-->>API: analysis_id
    API->>DB: save_comments
    API-->>FE: SentimentAnalysisResponse
    FE->>FE: Display Dashboard
    FE-->>User: Show results
```

---

## 2. SO DO PHAN TICH TU URL YOUTUBE

```
sequenceDiagram
    autonumber
    participant User as User
    participant FE as Frontend React
    participant API as Backend FastAPI
    participant DP as DataProcessor
    participant YT as YouTubeDataFetcher
    participant YTApi as YouTube API
    participant SA as SentimentAnalyzer
    participant DB as MongoDB

    User->>FE: Enter YouTube URL
    User->>FE: Select max comments
    User->>FE: Click Analyze URL
    FE->>FE: Show loading
    FE->>API: POST /api/v1/analyze-url
    API->>DP: validate_url
    DP-->>API: valid
    API->>DP: detect_platform
    DP-->>API: youtube
    API->>DP: extract_video_id
    DP-->>API: video_id
    API->>YT: fetch_comments
    loop Pagination
        YT->>YTApi: GET commentThreads
        YTApi-->>YT: comments + nextPageToken
    end
    YT-->>API: comment_data
    API->>DP: process_comments
    DP-->>API: cleaned_comments
    loop Each comment
        API->>SA: analyze_comment
        SA->>SA: PhoBERT Inference
        SA-->>API: CommentAnalysis
    end
    API->>API: Calculate statistics
    API->>DB: Save results
    DB-->>API: Confirm
    API-->>FE: SentimentAnalysisResponse
    FE->>FE: Hide loading
    FE-->>User: Display results
```

---

## 3. SO DO XU LY PHOBERT

```
sequenceDiagram
    autonumber
    participant Input as Input Text
    participant PP as Preprocessing
    participant TK as Tokenizer BPE
    participant EMB as Embedding Layer
    participant TF as Transformer 12 Layers
    participant ATT as Self Attention
    participant FFN as Feed Forward
    participant CLS as Classification
    participant SM as Softmax
    participant Out as Output

    Input->>PP: Raw text
    Note over PP: Preprocessing
    PP->>PP: lowercase
    PP->>PP: remove URLs
    PP->>PP: normalize whitespace
    PP->>TK: cleaned text
    Note over TK: Tokenization
    TK->>TK: split to tokens
    TK->>TK: add CLS SEP
    TK->>TK: convert to IDs
    TK->>EMB: token IDs
    Note over EMB: Embedding 768 dim
    EMB->>EMB: token embedding
    EMB->>EMB: position embedding
    EMB->>TF: embeddings
    loop 12 Layers
        TF->>ATT: hidden states
        ATT->>ATT: compute Q K V
        ATT->>ATT: attention scores
        ATT->>TF: attention output
        TF->>TF: layer norm
        TF->>FFN: normalized
        FFN->>FFN: linear 768 to 3072
        FFN->>FFN: GELU
        FFN->>FFN: linear 3072 to 768
        FFN->>TF: FFN output
        TF->>TF: layer norm
    end
    TF->>CLS: CLS embedding
    Note over CLS: Classification Head
    CLS->>CLS: pooler dense
    CLS->>CLS: dropout 0.1
    CLS->>CLS: linear 768 to 3
    CLS->>SM: logits
    Note over SM: Softmax
    SM->>SM: probabilities
    SM->>Out: prediction
    Out->>Out: argmax
    Out->>Out: confidence
```

---

## 4. SO DO LUU TRU DU LIEU

```
sequenceDiagram
    autonumber
    participant API as Backend API
    participant DB as MongoDB
    participant SA as sentiment_analyses
    participant CM as comments
    participant ST as statistics

    Note over API,ST: SAVE ANALYSIS RESULT
    API->>DB: get_database
    DB-->>API: connection
    API->>SA: save_analysis
    Note over SA: Save summary data
    SA-->>API: analysis_id
    API->>CM: save_comments
    Note over CM: Save comment details
    CM-->>API: inserted_count
    API->>ST: update_statistics
    Note over ST: Update daily stats
    ST-->>API: updated

    Note over API,ST: QUERY HISTORY
    API->>DB: get_analysis_history
    DB->>SA: find sort limit
    SA-->>DB: documents
    DB-->>API: history
    API->>DB: get_statistics
    DB->>ST: aggregate
    ST-->>DB: daily_stats
    DB-->>API: statistics
```

---

## 5. SO DO HEALTH CHECK

```
sequenceDiagram
    autonumber
    participant Client as Client
    participant API as Backend API
    participant DB as MongoDB
    participant SA as SentimentAnalyzer

    Client->>API: GET /api/v1/health
    API->>DB: get_database
    alt DB connected
        DB-->>API: OK
        API->>API: db_connected true
    else DB error
        DB-->>API: failed
        API->>API: db_connected false
    end
    API->>SA: get_analyzer
    SA-->>API: analyzer
    API->>API: check model_loaded
    alt All OK
        API-->>Client: healthy
    else Partial
        API-->>Client: degraded
    end
```

---

## 6. SO DO KIEN TRUC TONG QUAN

```
flowchart TB
    subgraph Frontend
        UI[DataInput]
        Dashboard[Dashboard]
        Chart[SentimentChart]
        ApiService[api.js]
    end
    
    subgraph Backend
        Router[routes.py]
        DP[DataProcessor]
        SA[SentimentAnalyzer]
        YT[YouTubeDataFetcher]
        
        subgraph PhoBERT
            Tokenizer[Tokenizer]
            Encoder[Transformer]
            Classifier[Classifier]
        end
    end
    
    subgraph Database
        Analyses[(analyses)]
        Comments[(comments)]
        Stats[(statistics)]
    end
    
    subgraph External
        YouTubeAPI[YouTube API]
    end
    
    UI --> ApiService
    ApiService --> Router
    Router --> DP
    Router --> SA
    Router --> YT
    YT --> YouTubeAPI
    SA --> PhoBERT
    Router --> Database
    Router --> ApiService
    ApiService --> Dashboard
    ApiService --> Chart
```

---

## 7. SO DO USECASE TONG QUAT

Dua tren phan tich thuc te Frontend va Backend cua project:

```
flowchart TB
    User((User))
    
    subgraph System[He Thong Phan Tich Cam Xuc]
        UC1[Nhap binh luan thu cong]
        UC2[Phan tich tu URL YouTube]
        UC3[Xem ket qua phan tich]
        UC4[Xem bieu do thong ke]
    end
    
    User --> UC1
    User --> UC2
    UC1 -.->|include| UC3
    UC2 -.->|include| UC3
    UC3 -.->|include| UC4
```

**Phien ban tieng Anh:**

```
flowchart TB
    User((User))
    
    subgraph System[Sentiment Analysis System]
        UC1[Enter Comments Manually]
        UC2[Analyze YouTube URL]
        UC3[View Results]
        UC4[View Chart]
    end
    
    User --> UC1
    User --> UC2
    UC1 -.->|include| UC3
    UC2 -.->|include| UC3
    UC3 -.->|include| UC4
```

### BANG MO TA USECASE

| STT | Use Case | Mo ta | Actor |
|-----|----------|-------|-------|
| UC1 | Nhap binh luan thu cong | User nhap cac binh luan vao textarea, moi dong 1 binh luan | User |
| UC2 | Phan tich tu URL YouTube | User dan link YouTube, he thong tu dong lay binh luan | User |
| UC3 | Xem ket qua phan tich | Xem cam xuc tong the, thong ke, chi tiet tung binh luan, canh bao noi dung, de xuat | User |
| UC4 | Xem bieu do thong ke | Xem Pie Chart va Bar Chart phan bo Positive/Negative/Neutral | User |

### DAC TA USECASE CHI TIET

**UC1: Nhap binh luan thu cong**
- Actor: User
- Mo ta: User nhap truc tiep cac binh luan can phan tich
- Tien dieu kien: User truy cap he thong
- Luong chinh:
  1. User chon tab Nhap binh luan
  2. User nhap binh luan vao textarea (moi dong 1 binh luan)
  3. User click nut Phan tich cam xuc ngay
  4. He thong goi API /analyze
  5. He thong hien thi ket qua (UC3)
- Hau dieu kien: Ket qua phan tich duoc hien thi

**UC2: Phan tich tu URL YouTube**
- Actor: User
- Mo ta: User dan link YouTube de he thong lay binh luan tu dong
- Tien dieu kien: User co link YouTube hop le
- Luong chinh:
  1. User chon tab Phan tich tu URL
  2. User dan URL YouTube
  3. User chon so luong binh luan toi da (100-10000)
  4. User click nut Phan tich tu URL
  5. He thong goi YouTube API lay binh luan
  6. He thong goi API /analyze-url
  7. He thong hien thi ket qua (UC3)
- Hau dieu kien: Ket qua phan tich duoc hien thi

**UC3: Xem ket qua phan tich**
- Actor: User
- Mo ta: User xem ket qua sau khi phan tich
- Tien dieu kien: Da thuc hien UC1 hoac UC2
- Noi dung hien thi:
  - Cam xuc tong the (Positive/Negative/Neutral)
  - Thong ke: Tong binh luan, so luong va % tung loai cam xuc
  - Do tin cay trung binh
  - Canh bao noi dung (bao luc, chinh tri) - neu co
  - De xuat cua he thong
  - Chi tiet tung binh luan voi sentiment va confidence
- Hau dieu kien: User da xem ket qua

---

## HUONG DAN SU DUNG

1. Mo https://mermaid.live/
2. Xoa code mac dinh trong panel ben trai
3. Dan code Mermaid vao (chi copy phan trong ```...```, KHONG copy ky hieu ``` )
4. Diagram se hien thi o panel ben phai
5. Click Actions -> Download PNG de tai hinh anh
6. Chen hinh vao Word/PowerPoint
