from typing import List, Optional, Dict, Any
import re
import logging
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class DataProcessor:
    """Process and clean text data"""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove mentions and hashtags symbols but keep the text
        text = re.sub(r'@', '', text)
        text = re.sub(r'#', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text.strip()
    
    @staticmethod
    def process_comments(comments: List[str]) -> List[str]:
        """Process a list of comments"""
        processed = []
        for comment in comments:
            cleaned = DataProcessor.clean_text(comment)
            if cleaned:  # Only add non-empty comments
                processed.append(cleaned)
        return processed
    
    @staticmethod
    def extract_video_id_from_youtube_url(url: str) -> Optional[str]:
        """Extract video ID from YouTube URL"""
        try:
            parsed_url = urlparse(url)
            
            if 'youtube.com' in parsed_url.netloc:
                # URL format: https://www.youtube.com/watch?v=VIDEO_ID
                query_params = parse_qs(parsed_url.query)
                return query_params.get('v', [None])[0]
            elif 'youtu.be' in parsed_url.netloc:
                # URL format: https://youtu.be/VIDEO_ID
                return parsed_url.path.lstrip('/')
            
            return None
        except Exception as e:
            logger.error(f"Error extracting video ID: {e}")
            return None
    
    @staticmethod
    def detect_platform(url: str) -> Optional[str]:
        """Detect social media platform from URL"""
        url_lower = url.lower()
        
        if 'youtube.com' in url_lower or 'youtu.be' in url_lower:
            return 'youtube'
        elif 'facebook.com' in url_lower or 'fb.com' in url_lower:
            return 'facebook'
        elif 'twitter.com' in url_lower or 'x.com' in url_lower:
            return 'twitter'
        elif 'instagram.com' in url_lower:
            return 'instagram'
        elif 'tiktok.com' in url_lower:
            return 'tiktok'
        
        return None
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Validate if URL is valid"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except Exception:
            return False

class YouTubeDataFetcher:
    """Fetch data from YouTube"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
    
    def fetch_comments(self, video_id: str, max_results: int = 100) -> List[Dict[str, Any]]:
        """
        Fetch comments from YouTube video with pagination support
        Note: This requires YouTube Data API key
        """
        if not self.api_key:
            logger.warning("YouTube API key not provided. Cannot fetch comments.")
            return []
        
        try:
            # YouTube Data API v3 endpoint
            base_url = "https://www.googleapis.com/youtube/v3/commentThreads"
            all_comments = []
            next_page_token = None
            
            # Fetch comments with pagination
            while len(all_comments) < max_results:
                params = {
                    'part': 'snippet',
                    'videoId': video_id,
                    'maxResults': min(100, max_results - len(all_comments)),  # API max is 100 per request
                    'key': self.api_key,
                    'order': 'relevance'
                }
                
                # Add page token if exists (for pagination)
                if next_page_token:
                    params['pageToken'] = next_page_token
                
                response = requests.get(base_url, params=params, timeout=10)
                response.raise_for_status()
                
                data = response.json()
                
                # Extract comments from current page
                for item in data.get('items', []):
                    snippet = item['snippet']['topLevelComment']['snippet']
                    all_comments.append({
                        'text': snippet['textDisplay'],
                        'author': snippet['authorDisplayName'],
                        'likes': snippet.get('likeCount', 0),
                        'published_at': snippet['publishedAt']
                    })
                
                # Check if there are more pages
                next_page_token = data.get('nextPageToken')
                
                # Break if no more pages or reached desired count
                if not next_page_token or len(all_comments) >= max_results:
                    break
                
                logger.info(f"Fetched {len(all_comments)} comments so far, continuing to next page...")
            
            logger.info(f"Total comments fetched: {len(all_comments)}")
            return all_comments
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching YouTube comments: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return []

def get_data_processor() -> DataProcessor:
    """Get data processor instance"""
    return DataProcessor()