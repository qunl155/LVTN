# SO DO TUAN TU - HE THONG PHAN TICH CAM XUC

## 1. SO DO TUAN TU TONG HOP (COMBINED)

So do nay the hien tat ca cac luong xu ly chinh cua he thong:

```
sequenceDiagram
    autonumber
    participant User as User
    participant FE as Frontend
    participant API as Backend API
    participant DP as DataProcessor
    participant YT as YouTubeDataFetcher
    participant YTApi as YouTube API
    participant SA as SentimentAnalyzer
    participant DB as MongoDB

    Note over User,DB: === PHAN TICH TU VAN BAN ===
    User->>FE: Nhap binh luan + Click Phan tich
    FE->>API: POST /api/v1/analyze
    API->>DP: process_comments
    DP-->>API: cleaned_comments
    loop Each comment
        API->>SA: analyze_comment
        Note over SA: PhoBERT Inference
        SA-->>API: sentiment + confidence
    end
    API->>DB: save_analysis + save_comments
    DB-->>API: analysis_id
    API-->>FE: SentimentAnalysisResponse
    FE-->>User: Display Dashboard + Chart

    Note over User,DB: === PHAN TICH TU YOUTUBE URL ===
    User->>FE: Nhap URL + Click Phan tich
    FE->>API: POST /api/v1/analyze-url
    API->>DP: validate_url + extract_video_id
    DP-->>API: video_id
    API->>YT: fetch_comments
    loop Pagination
        YT->>YTApi: GET commentThreads
        YTApi-->>YT: comments
    end
    YT-->>API: comment_data
    API->>DP: process_comments
    loop Each comment
        API->>SA: analyze_comment
        SA-->>API: sentiment + confidence
    end
    API->>DB: save_analysis + save_comments
    API-->>FE: SentimentAnalysisResponse
    FE-->>User: Display Dashboard + Chart

    Note over User,DB: === XEM LICH SU ===
    User->>FE: Click tab Lich su
    FE->>FE: Clear analysis results
    FE->>API: GET /api/v1/history
    API->>DB: get_analysis_history
    DB-->>API: history list
    API-->>FE: history data
    FE-->>User: Display history list

    Note over User,DB: === XEM CHI TIET LICH SU ===
    User->>FE: Click item lich su
    FE->>API: GET /api/v1/history/{id}
    API->>DB: get_analysis_by_id
    DB-->>API: analysis info
    API->>DB: get_comments_by_analysis
    DB-->>API: comments list
    API-->>FE: analysis + comments
    FE-->>User: Display comments detail

    Note over User,DB: === HEALTH CHECK ===
    FE->>API: GET /api/v1/health (every 30s)
    API->>DB: check connection
    API->>SA: check model_loaded
    API-->>FE: status + db_connected + model_loaded
    FE-->>User: Display status bar
```

---

## 2. SO DO XU LY PHOBERT

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

## 3. SO DO KIEN TRUC TONG QUAN

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

## 4. SO DO USECASE TONG QUAT

```
flowchart TB
    User((User))
    
    subgraph System[Sentiment Analysis System]
        UC1[Enter Comments]
        UC2[Analyze YouTube URL]
        UC3[View Results]
        UC4[View Chart]
        UC5[View History]
        UC6[View History Detail]
        UC7[View System Status]
    end
    
    User --> UC1
    User --> UC2
    User --> UC5
    User --> UC7
    UC1 -.->|include| UC3
    UC2 -.->|include| UC3
    UC3 -.->|include| UC4
    UC5 -.->|extend| UC6
```

### BANG MO TA USECASE

| STT | Use Case | Mo ta | Actor |
|-----|----------|-------|-------|
| UC1 | Nhap binh luan thu cong | User nhap cac binh luan vao textarea, moi dong 1 binh luan | User |
| UC2 | Phan tich tu URL YouTube | User dan link YouTube, he thong tu dong lay binh luan | User |
| UC3 | Xem ket qua phan tich | Xem cam xuc tong the, thong ke, chi tiet tung binh luan, canh bao, de xuat | User |
| UC4 | Xem bieu do thong ke | Xem Pie Chart va Bar Chart phan bo Positive/Negative/Neutral | User |
| UC5 | Xem lich su phan tich | Xem danh sach cac lan phan tich truoc do | User |
| UC6 | Xem chi tiet lich su | Click vao item lich su de xem lai cac comments da phan tich | User |
| UC7 | Xem trang thai he thong | Xem trang thai ket noi Database va Model AI | User |

---

## HUONG DAN SU DUNG

1. Mo https://mermaid.live/
2. Xoa code mac dinh trong panel ben trai
3. Dan code Mermaid vao (chi copy phan trong ```...```, KHONG copy ky hieu ``` )
4. Diagram se hien thi o panel ben phai
5. Click Actions -> Download PNG de tai hinh anh
6. Chen hinh vao Word/PowerPoint
