from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

# Get the backend directory (parent of src)
BACKEND_DIR = Path(__file__).parent.parent.parent
ENV_FILE = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    # MongoDB Configuration
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "sentiment_analysis_db"
    
    # Model Configuration
    SENTIMENT_MODEL_PATH: str = "./ml_model/phobert_tuned_model/"
    
    # CORS Configuration  
    ALLOW_ORIGINS: str = "http://localhost:3000,http://localhost:3001"
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Social Media Sentiment Analysis System"
    VERSION: str = "1.0.0"
    
    # YouTube API (optional - for fetching comments)
    YOUTUBE_API_KEY: str = ""
    
    # Analysis Configuration
    MAX_COMMENTS_PER_REQUEST: int = 10000  # Increased to match max_comments limit
    VIOLENCE_KEYWORDS: List[str] = ["bạo lực", "đánh", "giết", "violence", "kill", "attack"]
    POLITICAL_KEYWORDS: List[str] = ["chính trị", "chính phủ", "đảng", "political", "government", "party"]
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.ALLOW_ORIGINS.split(",")]
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = True

settings = Settings()