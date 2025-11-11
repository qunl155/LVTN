from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class SentimentLabel(str, Enum):
    """Sentiment labels"""
    POSITIVE = "positive"  # Tích cực
    NEGATIVE = "negative"  # Tiêu cực
    NEUTRAL = "neutral"    # Trung tính

class ContentType(str, Enum):
    """Content type classification"""
    NORMAL = "normal"
    POLITICAL = "political"  # Chính trị
    VIOLENCE = "violence"    # Bạo lực
    SPAM = "spam"

class CommentAnalysis(BaseModel):
    """Individual comment analysis result"""
    text: str
    sentiment: SentimentLabel
    confidence: float = Field(..., ge=0.0, le=1.0)
    content_type: ContentType = ContentType.NORMAL
    keywords_detected: List[str] = []

class SentimentRequest(BaseModel):
    """Request model for sentiment analysis"""
    comments: List[str] = Field(..., min_items=1)
    source_url: Optional[str] = None
    source_platform: Optional[str] = None  # youtube, facebook, twitter, etc.

class SentimentStats(BaseModel):
    """Statistics for sentiment analysis"""
    total_comments: int
    positive_count: int
    negative_count: int
    neutral_count: int
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    average_confidence: float

class ContentWarning(BaseModel):
    """Warning about content issues"""
    has_warning: bool
    warning_types: List[ContentType] = []
    warning_message: str = ""
    affected_comments_count: int = 0

class SentimentAnalysisResponse(BaseModel):
    """Response model for sentiment analysis"""
    analysis_id: str
    comments_analysis: List[CommentAnalysis]
    statistics: SentimentStats
    overall_sentiment: SentimentLabel
    content_warning: ContentWarning
    recommendation: str  # Đề xuất cho người dùng
    analyzed_at: datetime = Field(default_factory=datetime.utcnow)

class AnalysisHistory(BaseModel):
    """Historical analysis record"""
    id: Optional[str] = None
    source_url: Optional[str] = None
    source_platform: Optional[str] = None
    statistics: Dict[str, Any]
    overall_sentiment: str
    warning_types: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SourceAnalysisRequest(BaseModel):
    """Request to analyze from URL source"""
    url: str = Field(..., description="URL to YouTube video, Facebook post, etc.")
    max_comments: int = Field(default=500, ge=1, le=10000, description="Maximum number of comments to fetch and analyze")

class HealthCheckResponse(BaseModel):
    """Health check response"""
    model_config = {"protected_namespaces": ()}
    
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    database_connected: bool
    model_loaded: bool
