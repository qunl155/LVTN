import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DataInput from './components/DataInput';
import SentimentChart from './components/SentimentChart';
import './styles/App.css';

const App = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Đang phân tích...');

    const handleAnalysisComplete = (data) => {
        setAnalysisData(data);
        setLoadingMessage('Đang phân tích...');
    };

    return (
        <div className="App">
            <header className="app-header">
                <h1> Hệ Thống Phân Tích Cảm Xúc Mạng Xã Hội</h1>
                <p>Phân tích cảm xúc và nội dung từ bình luận người dùng</p>
            </header>
            
            <main className="app-main">
                <DataInput 
                    onAnalysisComplete={handleAnalysisComplete}
                    setLoading={setLoading}
                    setLoadingMessage={setLoadingMessage}
                />
                
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>{loadingMessage}</p>
                        <small style={{color: '#666', marginTop: '10px'}}>
                            Việc phân tích nhiều bình luận có thể mất vài phút. Vui lòng đợi...
                        </small>
                    </div>
                )}
                
                {analysisData && !loading && (
                    <>
                        <Dashboard data={analysisData} />
                        <SentimentChart data={analysisData} />
                    </>
                )}
            </main>
            
            <footer className="app-footer">
                <p>© 2025 Sentiment Analysis System - LVTN</p>
            </footer>
        </div>
    );
};

export default App;