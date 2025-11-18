import joblib
import numpy as np
from typing import List, Dict, Tuple
import re
import logging
import torch
import os
from pathlib import Path
from ..models.sentiment import SentimentLabel, ContentType, CommentAnalysis
from ..config.settings import settings, BACKEND_DIR

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """Sentiment analysis service using ML model"""
    
    def __init__(self, model_path: str = None):
        """Initialize sentiment analyzer with ML model"""
        self.model_path = model_path or settings.SENTIMENT_MODEL_PATH
        # Convert relative path to absolute path based on backend directory
        if not os.path.isabs(self.model_path):
            self.model_path = str(BACKEND_DIR / self.model_path)
        self.model = None
        self.vectorizer = None
        self.load_model()
        
    def load_model(self):
        """Load the pre-trained sentiment model"""
        try:
            # Check if path exists
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model path not found at {self.model_path}")
            
            # Check if it's a directory (transformer model folder) or a file
            if os.path.isdir(self.model_path):
                # Load as transformer model from directory
                try:
                    from transformers import AutoModelForSequenceClassification, AutoTokenizer
                    
                    self.model = AutoModelForSequenceClassification.from_pretrained(self.model_path)
                    self.vectorizer = AutoTokenizer.from_pretrained(self.model_path,device='gpu' if torch.cuda.is_available() else 'cpu')
                    logger.info(f"Loaded transformer model from directory: {self.model_path}")
                    
                except ImportError:
                    logger.error("transformers library not installed. Install with: pip install transformers torch")
                    raise
                except Exception as e:
                    logger.error(f"Failed to load transformer model from {self.model_path}: {e}")
                    raise
            else:
                # It's a file, determine file type and load accordingly
                file_extension = os.path.splitext(self.model_path)[1].lower()
                
                if file_extension == '.safetensors':
                    # Load safetensors model (PhoBERT or transformer models)
                    try:
                        from safetensors import safe_open
                        from transformers import AutoModelForSequenceClassification, AutoTokenizer
                        
                        # Try to load as transformer model from parent directory
                        model_dir = os.path.dirname(self.model_path)
                        try:
                            self.model = AutoModelForSequenceClassification.from_pretrained(model_dir)
                            self.vectorizer = AutoTokenizer.from_pretrained(model_dir)
                            logger.info(f"Loaded transformer model from {model_dir}")
                        except:
                            # If not a full transformer model, just load the weights
                            with safe_open(self.model_path, framework="pt") as f:
                                self.model = {key: f.get_tensor(key) for key in f.keys()}
                            logger.info(f"Loaded safetensors weights from {self.model_path}")
                    except ImportError:
                        logger.error("safetensors or transformers library not installed. Install with: pip install safetensors transformers")
                        raise
                        
                elif file_extension in ['.pkl', '.joblib']:
                    # Load joblib/pickle model (scikit-learn models)
                    model_data = joblib.load(self.model_path)
                    
                    # If model and vectorizer are saved separately
                    if isinstance(model_data, dict):
                        self.model = model_data.get('model')
                        self.vectorizer = model_data.get('vectorizer')
                    else:
                        self.model = model_data
                        
                    logger.info(f"Loaded joblib model from {self.model_path}")
                else:
                    raise ValueError(f"Unsupported model format: {file_extension}")
            
            logger.info(f"Model loaded successfully from {self.model_path}")
            
        except FileNotFoundError:
            logger.warning(f"Model path not found at {self.model_path}. Using rule-based analysis.")
            self.model = None
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = None
    
    def preprocess_text(self, text: str) -> str:
        """Preprocess text before analysis"""
        # Convert to lowercase
        text = text.lower()
        # Remove URLs
        text = re.sub(r'http\S+|www.\S+', '', text)
        # Remove special characters but keep Vietnamese characters
        text = re.sub(r'[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]', '', text)
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def detect_content_type(self, text: str) -> Tuple[ContentType, List[str]]:
        """Detect if content contains violence, political, or other sensitive topics"""
        text_lower = text.lower()
        detected_keywords = []
        
        # Check for violence keywords
        violence_found = [kw for kw in settings.VIOLENCE_KEYWORDS if kw.lower() in text_lower]
        if violence_found:
            detected_keywords.extend(violence_found)
            return ContentType.VIOLENCE, detected_keywords
        
        # Check for political keywords
        political_found = [kw for kw in settings.POLITICAL_KEYWORDS if kw.lower() in text_lower]
        if political_found:
            detected_keywords.extend(political_found)
            return ContentType.POLITICAL, detected_keywords
        
        return ContentType.NORMAL, []
    
    def predict_sentiment_ml(self, text: str) -> Tuple[SentimentLabel, float]:
        """Predict sentiment using ML model"""
        try:
            processed_text = self.preprocess_text(text)
            
            # Check if using transformer model
            if hasattr(self.model, 'forward') and hasattr(self.vectorizer, 'encode'):
                # Transformer model (PhoBERT, BERT, etc.)
                import torch
                
                # Tokenize input
                inputs = self.vectorizer(processed_text, return_tensors="pt", 
                                        truncation=True, padding=True, max_length=256)
                
                # Get prediction
                with torch.no_grad():
                    outputs = self.model(**inputs)
                    logits = outputs.logits
                    probabilities = torch.softmax(logits, dim=1)[0]
                    prediction = torch.argmax(probabilities).item()
                    confidence = float(probabilities[prediction])
                
            else:
                # Traditional ML model (scikit-learn)
                # Vectorize the text if vectorizer exists
                if self.vectorizer:
                    text_vectorized = self.vectorizer.transform([processed_text])
                else:
                    text_vectorized = [processed_text]
                
                # Get prediction and probability
                prediction = self.model.predict(text_vectorized)[0]
                probabilities = self.model.predict_proba(text_vectorized)[0]
                confidence = float(max(probabilities))
            
            # Map prediction to sentiment label
            # NOTE: Mapping adjusted to match your PhoBERT model's training labels
            # 0 = POSITIVE (Tích cực), 1 = NEUTRAL (Trung tính), 2 = NEGATIVE (Tiêu cực)
            sentiment_map = {
                0: SentimentLabel.POSITIVE,   # Tích cực
                1: SentimentLabel.NEUTRAL,    # Trung tính
                2: SentimentLabel.NEGATIVE,   # Tiêu cực
                'positive': SentimentLabel.POSITIVE,
                'neutral': SentimentLabel.NEUTRAL,
                'negative': SentimentLabel.NEGATIVE,
            }
            
            sentiment = sentiment_map.get(prediction, SentimentLabel.NEUTRAL)
            return sentiment, confidence
            
        except Exception as e:
            logger.error(f"Error in ML prediction: {e}")
            # Return neutral sentiment with low confidence if prediction fails
            return SentimentLabel.NEUTRAL, 0.5
    
    def analyze_comment(self, text: str) -> CommentAnalysis:
        """Analyze a single comment"""
        # Detect content type
        content_type, keywords = self.detect_content_type(text)
        
        # Predict sentiment using ML model only
        if self.model:
            sentiment, confidence = self.predict_sentiment_ml(text)
            logger.info(f"ML Model used for sentiment prediction.")
        else:
            # If no model loaded, return neutral sentiment
            logger.warning("No model loaded. Returning neutral sentiment.")
            sentiment = SentimentLabel.NEUTRAL
            confidence = 0.5
        
        return CommentAnalysis(
            text=text,
            sentiment=sentiment,
            confidence=confidence,
            content_type=content_type,
            keywords_detected=keywords
        )
    
    def analyze_comments(self, comments: List[str]) -> List[CommentAnalysis]:
        """Analyze multiple comments"""
        results = []
        for comment in comments:
            if comment and comment.strip():
                results.append(self.analyze_comment(comment))
        return results

# Global analyzer instance
_analyzer: SentimentAnalyzer = None

def get_analyzer() -> SentimentAnalyzer:
    """Get or create sentiment analyzer instance"""
    global _analyzer
    if _analyzer is None:
        _analyzer = SentimentAnalyzer()
    return _analyzer