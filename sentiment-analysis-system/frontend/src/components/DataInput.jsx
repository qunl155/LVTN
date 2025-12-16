import React, { useState, useEffect } from 'react';
import { analyzeSentiment, analyzeSentimentFromUrl, getAnalysisHistory, getAnalysisDetail } from '../services/api';

const DataInput = ({ onAnalysisComplete, setLoading, setLoadingMessage, systemHealth, onTabChange }) => {
    const [inputMode, setInputMode] = useState('text');
    const [commentsText, setCommentsText] = useState('');
    const [url, setUrl] = useState('');
    const [maxComments, setMaxComments] = useState(500);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [sentimentFilter, setSentimentFilter] = useState('all'); // 'all', 'positive', 'negative', 'neutral'

    // Handle tab change - clear analysis results and fetch history if needed
    useEffect(() => {
        // Clear analysis results when changing tabs
        if (onTabChange) {
            onTabChange();
        }

        if (inputMode === 'history') {
            fetchHistory();
            setSelectedAnalysis(null);
        }
    }, [inputMode]);

    const fetchHistory = async () => {
        try {
            setHistoryLoading(true);
            const data = await getAnalysisHistory(20);
            setHistory(data.history || []);
        } catch (err) {
            console.error('Error fetching history:', err);
            setHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleViewDetail = async (analysisId) => {
        try {
            setDetailLoading(true);
            setSentimentFilter('all'); // Reset filter when viewing new analysis
            const data = await getAnalysisDetail(analysisId);
            setSelectedAnalysis(data);
        } catch (err) {
            console.error('Error fetching detail:', err);
            setError('Không thể tải chi tiết phân tích');
        } finally {
            setDetailLoading(false);
        }
    };

    const handleTextAnalysis = async (e) => {
        e.preventDefault();
        setError('');

        if (!commentsText.trim()) {
            setError('Vui lòng nhập bình luận để phân tích');
            return;
        }

        try {
            setLoading(true);
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
            const estimatedMinutes = Math.ceil((maxComments * 0.1) / 60);
            setLoadingMessage(`Đang tải và phân tích ${maxComments} bình luận... `);

            const result = await analyzeSentimentFromUrl(url, maxComments);
            onAnalysisComplete(result);
        } catch (err) {
            setError(err.message || 'Lỗi khi phân tích. Vui lòng kiểm tra URL và thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive': return 'text-green-600 bg-green-100';
            case 'negative': return 'text-red-600 bg-red-100';
            default: return 'text-yellow-600 bg-yellow-100';
        }
    };

    const getSentimentEmoji = (sentiment) => {
        switch (sentiment) {
            case 'positive': return '😊';
            case 'negative': return '😟';
            default: return '😐';
        }
    };

    // Health Status Component (reusable)
    const HealthStatusBar = () => (
        systemHealth && (
            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-center gap-6 text-sm">
                    <span className="text-slate-500 font-medium">Trạng thái:</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${systemHealth.database_connected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                            <span className={`font-medium ${systemHealth.database_connected ? 'text-green-600' : 'text-red-600'}`}>
                                Database {systemHealth.database_connected ? 'OK' : 'Lỗi'}
                            </span>
                        </div>
                        <div className="w-px h-4 bg-slate-300"></div>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${systemHealth.model_loaded ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                            <span className={`font-medium ${systemHealth.model_loaded ? 'text-green-600' : 'text-red-600'}`}>
                                Model {systemHealth.model_loaded ? 'OK' : 'Lỗi'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            {/* Tab Headers - 3 tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/50">
                <button
                    className={`flex-1 py-4 px-6 text-sm md:text-base font-semibold flex items-center justify-center gap-2 transition-colors ${inputMode === 'text'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                        : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:bg-slate-50'
                        }`}
                    onClick={() => setInputMode('text')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Nhập bình luận
                </button>
                <button
                    className={`flex-1 py-4 px-6 text-sm md:text-base font-semibold flex items-center justify-center gap-2 transition-colors ${inputMode === 'url'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                        : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:bg-slate-50'
                        }`}
                    onClick={() => setInputMode('url')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Phân tích từ URL
                </button>
                <button
                    className={`flex-1 py-4 px-6 text-sm md:text-base font-semibold flex items-center justify-center gap-2 transition-colors ${inputMode === 'history'
                        ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                        : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent hover:bg-slate-50'
                        }`}
                    onClick={() => setInputMode('history')}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lịch sử
                </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col gap-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {inputMode === 'text' && (
                    <form onSubmit={handleTextAnalysis} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-slate-700 flex justify-between">
                                <span>Nhập bình luận (mỗi dòng một bình luận):</span>
                                <span className="text-xs font-normal text-slate-400">{commentsText.length} / 5000 ký tự</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    value={commentsText}
                                    onChange={(e) => setCommentsText(e.target.value)}
                                    className="w-full h-64 p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Ví dụ:
Video này rất hay và bổ ích!
Nội dung tệ quá, không nên xem.
Bình thường thôi, không có gì đặc sắc.
..."
                                    maxLength={5000}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Phân tích cảm xúc ngay
                        </button>

                        <HealthStatusBar />
                    </form>
                )}

                {inputMode === 'url' && (
                    <form onSubmit={handleUrlAnalysis} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-slate-700">
                                Nhập URL YouTube:
                            </label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            <p className="text-xs text-slate-500">
                                * Hiện tại chỉ hỗ trợ YouTube. Các nền tảng khác đang phát triển.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-slate-700">
                                Số lượng bình luận tối đa:
                            </label>
                            <select
                                value={maxComments}
                                onChange={(e) => setMaxComments(Number(e.target.value))}
                                className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="100">100 bình luận </option>
                                <option value="500">500 bình luận </option>
                                <option value="1000">1000 bình luận </option>
                                <option value="2000">2000 bình luận </option>
                                <option value="5000">5000 bình luận </option>
                                <option value="10000">10000 bình luận </option>
                            </select>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Nhiều bình luận hơn = Thời gian xử lý lâu hơn. Đừng đóng tab khi đang xử lý!
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Phân tích từ URL
                        </button>

                        <HealthStatusBar />
                    </form>
                )}

                {inputMode === 'history' && (
                    <div className="flex flex-col gap-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {selectedAnalysis ? 'Chi Tiết Phân Tích' : 'Lịch Sử Phân Tích'}
                            </h3>
                            <div className="flex gap-2">
                                {selectedAnalysis && (
                                    <button
                                        onClick={() => setSelectedAnalysis(null)}
                                        className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Quay lại
                                    </button>
                                )}
                                <button
                                    onClick={() => { fetchHistory(); setSelectedAnalysis(null); }}
                                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Làm mới
                                </button>
                            </div>
                        </div>

                        {/* Detail View */}
                        {selectedAnalysis ? (
                            detailLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang tải chi tiết...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {/* Analysis Summary */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Tổng comments</p>
                                                <p className="text-xl font-bold text-slate-800">{selectedAnalysis.comments_count}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Tích cực</p>
                                                <p className="text-xl font-bold text-green-600">
                                                    {selectedAnalysis.comments?.filter(c => c.sentiment === 'positive').length || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Tiêu cực</p>
                                                <p className="text-xl font-bold text-red-600">
                                                    {selectedAnalysis.comments?.filter(c => c.sentiment === 'negative').length || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Trung tính</p>
                                                <p className="text-xl font-bold text-yellow-600">
                                                    {selectedAnalysis.comments?.filter(c => c.sentiment === 'neutral').length || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sentiment Filter */}
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-slate-600">Lọc theo:</span>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSentimentFilter('all')}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${sentimentFilter === 'all'
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                </svg>
                                                Tất cả ({selectedAnalysis.comments?.length || 0})
                                            </button>
                                            <button
                                                onClick={() => setSentimentFilter('positive')}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${sentimentFilter === 'positive'
                                                    ? 'bg-green-600 text-white shadow-md'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                            >
                                                😊 Tích cực ({selectedAnalysis.comments?.filter(c => c.sentiment === 'positive').length || 0})
                                            </button>
                                            <button
                                                onClick={() => setSentimentFilter('negative')}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${sentimentFilter === 'negative'
                                                    ? 'bg-red-600 text-white shadow-md'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                            >
                                                😟 Tiêu cực ({selectedAnalysis.comments?.filter(c => c.sentiment === 'negative').length || 0})
                                            </button>
                                            <button
                                                onClick={() => setSentimentFilter('neutral')}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${sentimentFilter === 'neutral'
                                                    ? 'bg-yellow-500 text-white shadow-md'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    }`}
                                            >
                                                😐 Trung tính ({selectedAnalysis.comments?.filter(c => c.sentiment === 'neutral').length || 0})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments List */}
                                    <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                                        {selectedAnalysis.comments && selectedAnalysis.comments.length > 0 ? (
                                            selectedAnalysis.comments
                                                .filter(comment => sentimentFilter === 'all' || comment.sentiment === sentimentFilter)
                                                .length > 0 ? (
                                                selectedAnalysis.comments
                                                    .filter(comment => sentimentFilter === 'all' || comment.sentiment === sentimentFilter)
                                                    .map((comment, index) => (
                                                        <div
                                                            key={comment._id || index}
                                                            className={`p-3 rounded-lg border-l-4 ${comment.sentiment === 'positive' ? 'bg-green-50 border-l-green-500' :
                                                                comment.sentiment === 'negative' ? 'bg-red-50 border-l-red-500' :
                                                                    'bg-yellow-50 border-l-yellow-500'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-lg">{getSentimentEmoji(comment.sentiment)}</span>
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-slate-700">{comment.text}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getSentimentColor(comment.sentiment)}`}>
                                                                            {comment.sentiment === 'positive' ? 'Tích cực' :
                                                                                comment.sentiment === 'negative' ? 'Tiêu cực' : 'Trung tính'}
                                                                        </span>
                                                                        <span className="text-xs text-slate-400">
                                                                            {(comment.confidence * 100).toFixed(0)}% tin cậy
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="text-center text-slate-500 py-8">
                                                    Không có bình luận {sentimentFilter === 'positive' ? 'tích cực' : sentimentFilter === 'negative' ? 'tiêu cực' : 'trung tính'} nào
                                                </p>
                                            )
                                        ) : (
                                            <p className="text-center text-slate-500 py-8">Không có dữ liệu comments</p>
                                        )}
                                    </div>
                                </div>
                            )
                        ) : (
                            /* History List */
                            historyLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang tải lịch sử...</span>
                                    </div>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="font-medium">Chưa có lịch sử phân tích</p>
                                    <p className="text-sm mt-1">Hãy thử phân tích một số bình luận để xem kết quả ở đây.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                                    {history.map((item, index) => (
                                        <div
                                            key={item._id || index}
                                            onClick={() => handleViewDetail(item._id)}
                                            className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getSentimentColor(item.recommendation?.overall_sentiment || 'neutral')}`}>
                                                            {item.recommendation?.overall_sentiment === 'positive' ? 'Tích cực' :
                                                                item.recommendation?.overall_sentiment === 'negative' ? 'Tiêu cực' : 'Trung tính'}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            {item.source_type === 'youtube' ? '🎬 YouTube' : '📝 Nhập tay'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 font-medium">
                                                        {item.total_comments || 0} bình luận
                                                    </p>
                                                    {item.source_url && (
                                                        <p className="text-xs text-indigo-600 truncate mt-1">
                                                            {item.source_url}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <p className="text-xs text-slate-400">
                                                        {item.analyzed_at ? formatDate(item.analyzed_at) : 'N/A'}
                                                    </p>
                                                    <div className="flex gap-1 mt-2">
                                                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                            +{item.sentiment_summary?.positive || 0}
                                                        </span>
                                                        <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                                                            {item.sentiment_summary?.neutral || 0}
                                                        </span>
                                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                                                            -{item.sentiment_summary?.negative || 0}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-indigo-500 mt-2 flex items-center gap-1">
                                                        Xem chi tiết
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        <HealthStatusBar />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataInput;