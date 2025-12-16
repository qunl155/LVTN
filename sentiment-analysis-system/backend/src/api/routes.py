from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging
from datetime import datetime
import uuid

from ..models.sentiment import (
    SentimentRequest,
    SentimentAnalysisResponse,
    SentimentStats,
    ContentWarning,
    SourceAnalysisRequest,
    HealthCheckResponse,
    SentimentLabel,
    ContentType
)
from ..services.sentiment_analyzer import get_analyzer, SentimentAnalyzer
from ..services.data_processor import DataProcessor, YouTubeDataFetcher
from ..database.mongodb import get_database
from ..config.settings import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix=settings.API_V1_PREFIX, tags=["sentiment-analysis"])

# Dependency to get sentiment analyzer
def get_sentiment_analyzer() -> SentimentAnalyzer:
    return get_analyzer()

@router.post("/analyze", response_model=SentimentAnalysisResponse)
async def analyze_sentiment(
    request: SentimentRequest,
    analyzer: SentimentAnalyzer = Depends(get_sentiment_analyzer)
):
    """
    Analyze sentiment of comments
    
    - **comments**: List of comment texts to analyze
    - **source_url**: Optional URL of the source (YouTube, Facebook, etc.)
    - **source_platform**: Optional platform name
    """
    try:
        # Validate input
        if not request.comments or len(request.comments) == 0:
            raise HTTPException(status_code=400, detail="No comments provided")
        
        if len(request.comments) > settings.MAX_COMMENTS_PER_REQUEST:
            raise HTTPException(
                status_code=400,
                detail=f"Too many comments. Maximum is {settings.MAX_COMMENTS_PER_REQUEST}"
            )
        
        # Process and clean comments
        processor = DataProcessor()
        cleaned_comments = processor.process_comments(request.comments)
        
        if not cleaned_comments:
            raise HTTPException(status_code=400, detail="No valid comments after processing")
        
        # Analyze each comment
        analysis_results = analyzer.analyze_comments(cleaned_comments)
        
        # Calculate statistics
        total_comments = len(analysis_results)
        positive_count = sum(1 for r in analysis_results if r.sentiment == SentimentLabel.POSITIVE)
        negative_count = sum(1 for r in analysis_results if r.sentiment == SentimentLabel.NEGATIVE)
        neutral_count = sum(1 for r in analysis_results if r.sentiment == SentimentLabel.NEUTRAL)
        
        statistics = SentimentStats(
            total_comments=total_comments,
            positive_count=positive_count,
            negative_count=negative_count,
            neutral_count=neutral_count,
            positive_percentage=round((positive_count / total_comments) * 100, 2),
            negative_percentage=round((negative_count / total_comments) * 100, 2),
            neutral_percentage=round((neutral_count / total_comments) * 100, 2),
            average_confidence=round(sum(r.confidence for r in analysis_results) / total_comments, 3)
        )
        
        # Determine overall sentiment
        if positive_count > negative_count and positive_count > neutral_count:
            overall_sentiment = SentimentLabel.POSITIVE
        elif negative_count > positive_count and negative_count > neutral_count:
            overall_sentiment = SentimentLabel.NEGATIVE
        else:
            overall_sentiment = SentimentLabel.NEUTRAL
        
        # Check for content warnings
        warning_types = set()
        affected_count = 0
        for result in analysis_results:
            if result.content_type != ContentType.NORMAL:
                warning_types.add(result.content_type)
                affected_count += 1
        
        has_warning = len(warning_types) > 0
        warning_message = ""
        if has_warning:
            types_str = ", ".join([t.value for t in warning_types])
            warning_message = f"Phát hiện nội dung nhạy cảm: {types_str}. "
            warning_message += f"Có {affected_count}/{total_comments} bình luận chứa nội dung cảnh báo."
        
        content_warning = ContentWarning(
            has_warning=has_warning,
            warning_types=list(warning_types),
            warning_message=warning_message,
            affected_comments_count=affected_count
        )
        
        # Generate recommendation
        recommendation = generate_recommendation(overall_sentiment, statistics, content_warning)
        
        # Generate analysis ID
        analysis_id = str(uuid.uuid4())
        
        # Prepare analysis data for database
        analysis_data = {
            "analysis_id": analysis_id,
            "source_type": "text",
            "source_url": request.source_url,
            "source_platform": request.source_platform,
            "total_comments": total_comments,
            "sentiment_summary": {
                "positive": positive_count,
                "negative": negative_count,
                "neutral": neutral_count
            },
            "sentiment_percentages": {
                "positive": statistics.positive_percentage,
                "negative": statistics.negative_percentage,
                "neutral": statistics.neutral_percentage
            },
            "warning_flags": {
                "has_violence": ContentType.VIOLENCE in warning_types,
                "has_political": ContentType.POLITICAL in warning_types,
                "negative_ratio": statistics.negative_percentage / 100
            },
            "topics": [],  # Can be enhanced with topic extraction
            "recommendation": {
                "text": recommendation,
                "overall_sentiment": overall_sentiment.value
            }
        }
        
        # Save to database (if available)
        try:
            db = await get_database()
            
            # 1. Save analysis to sentiment_analyses collection
            saved_analysis_id = await db.save_analysis(analysis_data)
            
            # 2. Save comments to comments collection
            comments_to_save = [
                {
                    "analysis_id": saved_analysis_id,
                    "text": result.text,
                    "sentiment": result.sentiment.value,
                    "confidence": result.confidence,
                    "sentiment_scores": {
                        "positive": result.confidence if result.sentiment == SentimentLabel.POSITIVE else 0.0,
                        "neutral": result.confidence if result.sentiment == SentimentLabel.NEUTRAL else 0.0,
                        "negative": result.confidence if result.sentiment == SentimentLabel.NEGATIVE else 0.0
                    },
                    "flags": {
                        "is_violent": result.content_type == ContentType.VIOLENCE,
                        "is_political": result.content_type == ContentType.POLITICAL,
                        "is_spam": result.content_type == ContentType.SPAM
                    },
                    "keywords_detected": result.keywords_detected
                }
                for result in analysis_results
            ]
            await db.save_comments(comments_to_save)
            
            # 3. Update statistics
            await db.update_statistics(analysis_data)
            
            logger.info(f"Analysis saved to database with ID: {saved_analysis_id}")
        except Exception as e:
            logger.warning(f"Could not save to database: {e}")
        
        return SentimentAnalysisResponse(
            analysis_id=analysis_id,
            comments_analysis=analysis_results,
            statistics=statistics,
            overall_sentiment=overall_sentiment,
            content_warning=content_warning,
            recommendation=recommendation
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/analyze-url")
async def analyze_from_url(
    request: SourceAnalysisRequest,
    analyzer: SentimentAnalyzer = Depends(get_sentiment_analyzer)
):
    """
    Analyze sentiment from social media URL
    
    - **url**: URL to YouTube video, Facebook post, etc.
    - **max_comments**: Maximum number of comments to analyze (1-10000)
    """
    try:
        processor = DataProcessor()
        
        # Validate URL
        if not processor.validate_url(request.url):
            raise HTTPException(status_code=400, detail="Invalid URL")
        
        # Note: Removed existing analysis check - always fetch fresh comments
        
        # Detect platform
        platform = processor.detect_platform(request.url)
        if not platform:
            raise HTTPException(
                status_code=400,
                detail="Unsupported platform. Supported: YouTube, Facebook, Twitter"
            )
        
        comments = []
        
        # Fetch comments based on platform
        if platform == 'youtube':
            video_id = processor.extract_video_id_from_youtube_url(request.url)
            if not video_id:
                raise HTTPException(status_code=400, detail="Invalid YouTube URL")
            
            fetcher = YouTubeDataFetcher(api_key=settings.YOUTUBE_API_KEY)
            comment_data = fetcher.fetch_comments(video_id, request.max_comments)
            comments = [c['text'] for c in comment_data]
            print(len(comments))
        else:
            raise HTTPException(
                status_code=501,
                detail=f"{platform.capitalize()} fetching not implemented yet. Please provide comments manually."
            )
        
        if not comments:
            raise HTTPException(
                status_code=404,
                detail="No comments found or could not fetch comments. Make sure the URL is correct and has comments."
            )
        
        # Analyze the fetched comments
        sentiment_request = SentimentRequest(
            comments=comments,
            source_url=request.url,
            source_platform=platform
        )
        
        return await analyze_sentiment(sentiment_request, analyzer)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing from URL: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_analysis_history(limit: int = 10, skip: int = 0):
    """Get recent analysis history"""
    try:
        db = await get_database()
        history = await db.get_analysis_history(limit=limit, skip=skip)
        
        # Get total count
        total = await db.count_documents("sentiment_analyses")
        
        return {
            "total": total,
            "limit": limit,
            "skip": skip,
            "history": history
        }
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch history")

@router.get("/history/{analysis_id}")
async def get_analysis_detail(analysis_id: str, comments_limit: int = 500):
    """Get analysis detail with comments"""
    try:
        db = await get_database()
        
        # Get analysis info
        analysis = await db.get_analysis_by_id(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Get comments for this analysis
        comments = await db.get_comments_by_analysis(analysis_id, limit=comments_limit)
        
        return {
            "analysis": analysis,
            "comments": comments,
            "comments_count": len(comments)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching analysis detail: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch analysis detail")

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    db_connected = False
    try:
        db = await get_database()
        db_connected = True
    except:
        pass
    
    analyzer = get_analyzer()
    model_loaded = analyzer.model is not None
    
    return HealthCheckResponse(
        status="healthy" if db_connected else "degraded",
        database_connected=db_connected,
        model_loaded=model_loaded
    )

@router.get("/stats")
async def get_statistics(days: int = 7):
    """Get overall statistics from database"""
    try:
        db = await get_database()
        
        # Get daily statistics
        daily_stats = await db.get_statistics(days=days)
        
        # Get total statistics
        total_stats = await db.get_total_stats()
        
        return {
            "daily_statistics": daily_stats,
            "total_statistics": total_stats,
            "service": "Sentiment Analysis System",
            "version": settings.VERSION
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return {
            "daily_statistics": [],
            "total_statistics": {
                "total_analyses": 0,
                "total_comments": 0
            },
            "service": "Sentiment Analysis System",
            "version": settings.VERSION
        }

def generate_recommendation(
    overall_sentiment: SentimentLabel,
    statistics: SentimentStats,
    content_warning: ContentWarning
) -> str:
    """Generate recommendation for user based on analysis"""
    
    recommendations = []
    
    # Based on overall sentiment
    if overall_sentiment == SentimentLabel.POSITIVE:
        recommendations.append("Nội dung này nhận được phản hồi tích cực từ cộng đồng.")
    elif overall_sentiment == SentimentLabel.NEGATIVE:
        recommendations.append("Nội dung này nhận được nhiều phản hồi tiêu cực.")
    else:
        recommendations.append("Nội dung này nhận được phản hồi trung tính từ cộng đồng.")
    
    # Based on negative percentage
    if statistics.negative_percentage > 50:
        recommendations.append("Có hơn 50% bình luận tiêu cực. Nên cân nhắc trước khi xem.")
    elif statistics.negative_percentage > 30:
        recommendations.append("Có khá nhiều bình luận tiêu cực. Xem với sự thận trọng.")
    
    # Based on content warnings
    if content_warning.has_warning:
        if ContentType.VIOLENCE in content_warning.warning_types:
            recommendations.append("CẢNH BÁO: Phát hiện nội dung bạo lực trong bình luận.")
        if ContentType.POLITICAL in content_warning.warning_types:
            recommendations.append("CẢNH BÁO: Phát hiện nội dung chính trị nhạy cảm.")
    
    # Overall recommendation
    if content_warning.has_warning or statistics.negative_percentage > 50:
        recommendations.append("\nĐề xuất: NÊN CÂN NHẮC khi xem nội dung này.")
    elif statistics.positive_percentage > 70:
        recommendations.append("\nĐề xuất: NÊN XEM - Nội dung được đánh giá tốt.")
    else:
        recommendations.append("\nĐề xuất: Có thể xem nhưng nên lưu ý các ý kiến trái chiều.")
    
    return " ".join(recommendations)