import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import DataInput from './components/DataInput';
import SentimentChart from './components/SentimentChart';
import { healthCheck } from './services/api';

const App = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Đang phân tích...');
    const [systemHealth, setSystemHealth] = useState(null);

    // Fetch health status on mount and every 30 seconds
    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const health = await healthCheck();
                setSystemHealth(health);
            } catch (error) {
                setSystemHealth({ status: 'error', database_connected: false, model_loaded: false });
            }
        };

        fetchHealth();
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAnalysisComplete = (data) => {
        setAnalysisData(data);
        setLoadingMessage('Đang phân tích...');
    };

    const clearAnalysisData = () => {
        setAnalysisData(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif] text-slate-900">
            {/* Main Content */}
            <main className="min-h-screen relative">
                {/* Gradient Background */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 -z-0"></div>

                <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center gap-3 py-6">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Hệ thống phân tích cảm xúc
                        </h1>
                        <p className="text-slate-500 text-base max-w-2xl mx-auto">
                            Phân tích cảm xúc và nội dung từ bình luận người dùng mạng xã hội sử dụng mô hình AI tiên tiến.
                        </p>
                    </div>
                    <DataInput
                        onAnalysisComplete={handleAnalysisComplete}
                        setLoading={setLoading}
                        setLoadingMessage={setLoadingMessage}
                        systemHealth={systemHealth}
                        onTabChange={clearAnalysisData}
                    />
                    {loading && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-lg font-semibold text-slate-700">{loadingMessage}</p>
                            <p className="text-sm text-slate-500">
                                Việc phân tích nhiều bình luận có thể mất vài phút. Vui lòng đợi...
                            </p>
                        </div>
                    )}
                    {analysisData && !loading && (
                        <>
                            <Dashboard data={analysisData} />
                            <SentimentChart data={analysisData} />
                        </>
                    )}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-none">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-indigo-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 flex-1">
                            <h3 className="text-lg font-bold text-slate-900">Hướng dẫn sử dụng</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-slate-600">
                                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span><strong className="text-slate-900">Nhập Bình Luận:</strong> Nhập trực tiếp các bình luận vào ô văn bản, mỗi dòng một bình luận.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-600">
                                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span><strong className="text-slate-900">Phân Tích Từ URL:</strong> Dán link video YouTube để hệ thống tự động lấy bình luận.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-slate-600">
                                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Hệ thống phân loại cảm xúc: <span className="font-semibold text-emerald-600">Tích cực</span>, <span className="font-semibold text-red-600">Tiêu cực</span>, hoặc <span className="font-semibold text-slate-600">Trung tính</span>.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center mt-8 pb-4">
                        <p className="text-xs text-slate-400 font-medium">
                            © 2025 Sentiment Analysis System - LVTN. Powered by PhoBERT AI Model.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
