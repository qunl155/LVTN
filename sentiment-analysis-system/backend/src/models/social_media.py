from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime

class SocialMediaComment(BaseModel):
    """Model for social media comment"""
    id: Optional[str] = None
    text: str
    author: Optional[str] = None
    likes: int = 0
    replies: int = 0
    timestamp: Optional[datetime] = None
    sentiment: Optional[str] = None

class SocialMediaPost(BaseModel):
    """Social media post information"""
    id: str
    user: str
    content: str
    comments: List[SocialMediaComment]
    timestamp: str
    sentiment: Optional[str] = None

class YouTubeVideoInfo(BaseModel):
    """YouTube video information"""
    video_id: str
    title: Optional[str] = None
    channel_name: Optional[str] = None
    view_count: Optional[int] = None
    like_count: Optional[int] = None
    comment_count: Optional[int] = None

class FacebookPostInfo(BaseModel):
    """Facebook post information"""
    post_id: str
    content: Optional[str] = None
    author: Optional[str] = None
    reactions: Optional[int] = None
    shares: Optional[int] = None
    comment_count: Optional[int] = None

class SocialMediaSource(BaseModel):
    """Social media source information"""
    url: HttpUrl
    platform: str  # youtube, facebook, twitter, etc.
    comments: List[SocialMediaComment] = []
    metadata: Optional[dict] = None
    fetched_at: datetime = Field(default_factory=datetime.utcnow)