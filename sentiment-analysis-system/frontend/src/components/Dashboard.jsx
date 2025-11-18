import React, { useState } from 'react';

const Dashboard = ({ data }) => {
    const [displayCount, setDisplayCount] = useState(20);

    if (!data) {
        return null;
    }

    // Safe destructuring với default values
    const { 
        statistics = {}, 
        overall_sentiment = 'neutral', 
        content_warning = {}, 
        recommendation = '',
        comments_analysis = []
    } = data;

    // Kiểm tra statistics có data không
    if (!statistics || !statistics.total_comments) {
        return (
            <div className="dashboard-container">
                <p> Không có dữ liệu để hiển thị</p>
            </div>
        );
    }

    const getSentimentEmoji = (sentiment) => {
        switch (sentiment) {
            case 'positive':
                return '😊';
            case 'negative':
                return '😟';
            case 'neutral':
                return '😐';
            default:
                return '🤔';
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive':
                return '#4CAF50';
            case 'negative':
                return '#f44336';
            case 'neutral':
                return '#FFC107';
            default:
                return '#9E9E9E';
        }
    };

    return (
        <div className="dashboard-container">
            <h2> Kết Quả Phân Tích</h2>

            {/* Overall Sentiment */}
            <div className="overall-sentiment" style={{ backgroundColor: getSentimentColor(overall_sentiment) }}>
                <div className="sentiment-icon">{getSentimentEmoji(overall_sentiment)}</div>
                <div className="sentiment-text">
                    <h3>Cảm Xúc Tổng Thể</h3>
                    <p className="sentiment-label">
                        {overall_sentiment === 'positive' ? 'TÍCH CỰC' : 
                         overall_sentiment === 'negative' ? 'TIÊU CỰC' : 'TRUNG TÍNH'}
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="statistics-grid">
                <div className="stat-card">
                    <h4> Tổng Bình Luận</h4>
                    <p className="stat-value">{statistics.total_comments}</p>
                </div>

                <div className="stat-card positive">
                    <h4> Tích Cực</h4>
                    <p className="stat-value">{statistics.positive_count}</p>
                    <p className="stat-percentage">{statistics.positive_percentage}%</p>
                </div>

                <div className="stat-card negative">
                    <h4> Tiêu Cực</h4>
                    <p className="stat-value">{statistics.negative_count}</p>
                    <p className="stat-percentage">{statistics.negative_percentage}%</p>
                </div>

                <div className="stat-card neutral">
                    <h4> Trung Tính</h4>
                    <p className="stat-value">{statistics.neutral_count}</p>
                    <p className="stat-percentage">{statistics.neutral_percentage}%</p>
                </div>

                <div className="stat-card">
                    <h4> Độ Tin Cậy TB</h4>
                    <p className="stat-value">{(statistics.average_confidence * 100).toFixed(1)}%</p>
                </div>
            </div>

            {/* Content Warning */}
            {content_warning.has_warning && (
                <div className="warning-box">
                    <h3>⚠️ Cảnh Báo Nội Dung</h3>
                    <p>{content_warning.warning_message}</p>
                    <div className="warning-types">
                        {content_warning.warning_types.map((type, index) => (
                            <span key={index} className="warning-badge">
                                {type === 'violence' ? ' Bạo lực' : 
                                 type === 'political' ? ' Chính trị' : type}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendation */}
            <div className="recommendation-box">
                <h3> Đề Xuất</h3>
                <p className="recommendation-text">{recommendation}</p>
            </div>

            {/* Comments Analysis */}
            <div className="comments-analysis">
                <h3> Chi Tiết Bình Luận</h3>
                <div className="comments-list">
                    {comments_analysis && comments_analysis.length > 0 && comments_analysis.slice(0, displayCount).map((comment, index) => (
                        <div key={index} className={`comment-item ${comment.sentiment || 'neutral'}`}>
                            <div className="comment-header">
                                <span className="comment-emoji">{getSentimentEmoji(comment.sentiment)}</span>
                                <span className="comment-sentiment">
                                    {comment.sentiment === 'positive' ? 'Tích cực' :
                                     comment.sentiment === 'negative' ? 'Tiêu cực' : 'Trung tính'}
                                </span>
                                <span className="comment-confidence">
                                    {(comment.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                            {comment.keywords_detected && comment.keywords_detected.length > 0 && (
                                <div className="comment-keywords">
                                    {comment.keywords_detected.map((keyword, i) => (
                                        <span key={i} className="keyword-badge">{keyword}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {comments_analysis && comments_analysis.length > displayCount && (
                    <div className="load-more-container">
                        <p className="comments-note">
                            Hiển thị {displayCount}/{comments_analysis.length} bình luận
                        </p>
                        <button 
                            className="load-more-btn"
                            onClick={() => setDisplayCount(prev => Math.min(prev + 50, comments_analysis.length))}
                        >
                            Xem thêm 50 bình luận
                        </button>
                        {displayCount < comments_analysis.length - 50 && (
                            <button 
                                className="load-more-btn"
                                onClick={() => setDisplayCount(comments_analysis.length)}
                            >
                                Xem tất cả ({comments_analysis.length - displayCount} còn lại)
                            </button>
                        )}
                    </div>
                )}
                {comments_analysis && comments_analysis.length <= displayCount && comments_analysis.length > 0 && (
                    <p className="comments-note">
                        Hiển thị tất cả {comments_analysis.length} bình luận
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;