import React, { useState } from 'react';
import { analyzeSentiment, analyzeSentimentFromUrl } from '../services/api';

const DataInput = ({ onAnalysisComplete, setLoading, setLoadingMessage }) => {
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'url'
    const [commentsText, setCommentsText] = useState('');
    const [url, setUrl] = useState('');
    const [maxComments, setMaxComments] = useState(500); // Default 500 comments
    const [error, setError] = useState('');

    const handleTextAnalysis = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!commentsText.trim()) {
            setError('Vui lòng nhập bình luận để phân tích');
            return;
        }

        try {
            setLoading(true);
            // Split comments by newline
            const comments = commentsText
                .split('\n')
                .map(c => c.trim())
                .filter(c => c.length > 0);

            if (comments.length === 0) {
                setError('Không có bình luận hợp lệ');
                setLoading(false);
                return;
            }

            const result = await analyzeSentiment(comments);
            onAnalysisComplete(result);
        } catch (err) {
            setError(err.message || 'Lỗi khi phân tích. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleUrlAnalysis = async (e) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Vui lòng nhập URL');
            return;
        }

        try {
            setLoading(true);
            
            // Calculate estimated time
            const estimatedMinutes = Math.ceil((maxComments * 0.3) / 60);
            setLoadingMessage(`Đang tải và phân tích ${maxComments} bình luận... (Ước tính: ~${estimatedMinutes} phút)`);
            
            const result = await analyzeSentimentFromUrl(url, maxComments);
            onAnalysisComplete(result);
        } catch (err) {
            setError(err.message || 'Lỗi khi phân tích. Vui lòng kiểm tra URL và thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="data-input-container">
            <div className="input-mode-selector">
                <button
                    className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
                    onClick={() => setInputMode('text')}
                >
                     Nhập Bình Luận
                </button>
                <button
                    className={`mode-btn ${inputMode === 'url' ? 'active' : ''}`}
                    onClick={() => setInputMode('url')}
                >
                     Phân Tích Từ URL
                </button>
            </div>

            {error && (
                <div className="error-message">
                     {error}
                </div>
            )}

            {inputMode === 'text' ? (
                <form onSubmit={handleTextAnalysis} className="input-form">
                    <div className="form-group">
                        <label htmlFor="comments">
                            Nhập bình luận (mỗi dòng một bình luận):
                        </label>
                        <textarea
                            id="comments"
                            value={commentsText}
                            onChange={(e) => setCommentsText(e.target.value)}
                            placeholder="Nhập bình luận, mỗi dòng là một bình luận&#10;Ví dụ:&#10;Video này rất hay và bổ ích!&#10;Nội dung tệ quá&#10;Bình thường thôi"
                            rows="10"
                            className="comment-textarea"
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                         Phân Tích Cảm Xúc
                    </button>
                </form>
            ) : (
                <form onSubmit={handleUrlAnalysis} className="input-form">
                    <div className="form-group">
                        <label htmlFor="url">
                            Nhập URL (YouTube, Facebook, Twitter, v.v.):
                        </label>
                        <input
                            id="url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="url-input"
                        />
                        <small className="help-text">
                            * Hiện tại chỉ hỗ trợ YouTube. Các nền tảng khác đang phát triển.
                        </small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="maxComments">
                            Số lượng bình luận tối đa:
                        </label>
                        <select
                            id="maxComments"
                            value={maxComments}
                            onChange={(e) => setMaxComments(Number(e.target.value))}
                            className="max-comments-select"
                        >
                            <option value="100">100 bình luận (~30 giây)</option>
                            <option value="500">500 bình luận (~2-3 phút) - Khuyến nghị</option>
                            <option value="1000">1000 bình luận (~5 phút)</option>
                            <option value="2000">2000 bình luận (~10 phút)</option>
                            <option value="5000">5000 bình luận (~25 phút)</option>
                            <option value="10000">10000 bình luận (~50 phút) - Tối đa</option>
                        </select>
                        <small className="help-text">
                            ⚠️ Nhiều bình luận hơn = Thời gian xử lý lâu hơn. Đừng đóng tab khi đang xử lý!
                        </small>
                    </div>
                    
                    <button type="submit" className="submit-btn">
                        🔍 Phân Tích Từ URL
                    </button>
                </form>
            )}

            <div className="info-box">
                <h4>ℹ️ Hướng dẫn sử dụng:</h4>
                <ul>
                    <li><strong>Nhập Bình Luận:</strong> Nhập trực tiếp các bình luận, mỗi dòng một bình luận</li>
                    <li><strong>Phân Tích Từ URL:</strong> Nhập link video YouTube để tự động lấy và phân tích bình luận</li>
                    <li>Hệ thống sẽ phân loại cảm xúc: Tích cực, Tiêu cực, Trung tính</li>
                    <li>Phát hiện nội dung nhạy cảm: Bạo lực, Chính trị</li>
                    <li>Đưa ra đề xuất xem nội dung</li>
                </ul>
            </div>
        </div>
    );
};

export default DataInput;