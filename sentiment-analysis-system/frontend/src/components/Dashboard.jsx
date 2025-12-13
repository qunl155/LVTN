import React, { useState } from 'react';

const Dashboard = ({ data }) => {
    const [displayCount, setDisplayCount] = useState(20);

    if (!data) {
        return null;
    }

    const {
        statistics = {},
        overall_sentiment = 'neutral',
        content_warning = {},
        recommendation = '',
        comments_analysis = []
    } = data;

    if (!statistics || !statistics.total_comments) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
                <p className="text-slate-500">Không có dữ liệu để hiển thị</p>
            </div>
        );
    }

    const getSentimentEmoji = (sentiment) => {
        switch (sentiment) {
            case 'positive': return '😊';
            case 'negative': return '😟';
            case 'neutral': return '😐';
            default: return '🤔';
        }
    };

    const getSentimentConfig = (sentiment) => {
        switch (sentiment) {
            case 'positive':
                return { bg: 'bg-green-500', text: 'Tích Cực', icon: 'sentiment_satisfied' };
            case 'negative':
                return { bg: 'bg-red-500', text: 'Tiêu Cực', icon: 'sentiment_dissatisfied' };
            case 'neutral':
                return { bg: 'bg-yellow-500', text: 'Trung Tính', icon: 'sentiment_neutral' };
            default:
                return { bg: 'bg-slate-500', text: 'Không xác định', icon: 'help' };
        }
    };

    const sentimentConfig = getSentimentConfig(overall_sentiment);

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-900">Kết Quả Phân Tích</h2>

            {/* Overall Sentiment Banner */}
            <div className={`${sentimentConfig.bg} rounded-xl p-6 shadow-lg relative overflow-hidden text-white flex items-center gap-6`}>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <span className="text-4xl">{getSentimentEmoji(overall_sentiment)}</span>
                    </div>
                    <div>
                        <p className="text-white/90 text-sm font-medium mb-1">Cảm Xúc Tổng Thể</p>
                        <h3 className="text-3xl font-black uppercase tracking-wide">{sentimentConfig.text}</h3>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-8"></div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-blue-500 border border-slate-100">
                    <p className="text-slate-500 text-xs font-semibold mb-1">Tổng Bình Luận</p>
                    <p className="text-3xl font-bold text-slate-800">{statistics.total_comments}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-green-500 border border-slate-100">
                    <p className="text-slate-500 text-xs font-semibold mb-1">Tích Cực</p>
                    <p className="text-3xl font-bold text-slate-800">{statistics.positive_count}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">{statistics.positive_percentage}%</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-red-500 border border-slate-100">
                    <p className="text-slate-500 text-xs font-semibold mb-1">Tiêu Cực</p>
                    <p className="text-3xl font-bold text-slate-800">{statistics.negative_count}</p>
                    <p className="text-xs text-red-600 font-medium mt-1">{statistics.negative_percentage}%</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-yellow-500 border border-slate-100">
                    <p className="text-slate-500 text-xs font-semibold mb-1">Trung Tính</p>
                    <p className="text-3xl font-bold text-slate-800">{statistics.neutral_count}</p>
                    <p className="text-xs text-yellow-600 font-medium mt-1">{statistics.neutral_percentage}%</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-indigo-500 border border-slate-100">
                    <p className="text-slate-500 text-xs font-semibold mb-1">Độ Tin Cậy TB</p>
                    <p className="text-3xl font-bold text-slate-800">{(statistics.average_confidence * 100).toFixed(1)}%</p>
                </div>
            </div>

            {/* Content Warning */}
            {content_warning.has_warning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                    <div className="flex items-start gap-3 mb-2">
                        <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h4 className="font-bold text-yellow-800">Cảnh Báo Nội Dung</h4>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">{content_warning.warning_message}</p>
                    <div className="flex flex-wrap gap-2">
                        {content_warning.warning_types && content_warning.warning_types.map((type, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {type === 'violence' ? '⚠️ Bạo lực' : type === 'political' ? '🏛️ Chính trị' : type}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendation */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Đề Xuất
                </h4>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{recommendation}</p>
                    </div>
                </div>
            </div>

            {/* Comments Detail */}
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-800">Chi Tiết Bình Luận</h3>

                {comments_analysis && comments_analysis.slice(0, displayCount).map((comment, index) => {
                    const commentConfig = getSentimentConfig(comment.sentiment);
                    return (
                        <div
                            key={index}
                            className={`bg-white border-l-4 ${comment.sentiment === 'positive' ? 'border-l-green-500' :
                                    comment.sentiment === 'negative' ? 'border-l-red-500' : 'border-l-yellow-500'
                                } rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getSentimentEmoji(comment.sentiment)}</span>
                                    <span className={`font-bold text-sm ${comment.sentiment === 'positive' ? 'text-green-600' :
                                            comment.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>
                                        {commentConfig.text}
                                    </span>
                                </div>
                                <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600">
                                    {(comment.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                            {comment.keywords_detected && comment.keywords_detected.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {comment.keywords_detected.map((keyword, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Load More */}
                {comments_analysis && comments_analysis.length > displayCount && (
                    <div className="flex flex-col items-center gap-3 mt-4">
                        <p className="text-sm text-slate-500">
                            Hiển thị {displayCount}/{comments_analysis.length} bình luận
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDisplayCount(prev => Math.min(prev + 50, comments_analysis.length))}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Xem thêm 50 bình luận
                            </button>
                            {displayCount < comments_analysis.length - 50 && (
                                <button
                                    onClick={() => setDisplayCount(comments_analysis.length)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Xem tất cả ({comments_analysis.length - displayCount} còn lại)
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {comments_analysis && comments_analysis.length <= displayCount && comments_analysis.length > 0 && (
                    <p className="text-center text-sm text-slate-500 mt-2">
                        Hiển thị tất cả {comments_analysis.length} bình luận
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;