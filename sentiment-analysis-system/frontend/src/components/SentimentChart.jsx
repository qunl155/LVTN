import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const SentimentChart = ({ data }) => {
    if (!data || !data.statistics) {
        return null;
    }

    const { statistics } = data;

    // Pie Chart Data
    const pieChartData = {
        labels: ['Tích Cực', 'Tiêu Cực', 'Trung Tính'],
        datasets: [
            {
                label: 'Số lượng bình luận',
                data: [
                    statistics.positive_count,
                    statistics.negative_count,
                    statistics.neutral_count
                ],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(244, 67, 54, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(255, 193, 7, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Bar Chart Data
    const barChartData = {
        labels: ['Tích Cực', 'Tiêu Cực', 'Trung Tính'],
        datasets: [
            {
                label: 'Phần trăm (%)',
                data: [
                    statistics.positive_percentage,
                    statistics.negative_percentage,
                    statistics.neutral_percentage
                ],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.6)',
                    'rgba(244, 67, 54, 0.6)',
                    'rgba(255, 193, 7, 0.6)',
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(244, 67, 54, 1)',
                    'rgba(255, 193, 7, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 14
                    },
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.parsed.y.toFixed(1) + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="charts-container">
            <h2>📈 Biểu Đồ Phân Tích</h2>
            
            <div className="charts-grid">
                <div className="chart-box">
                    <h3>Phân Bố Cảm Xúc</h3>
                    <div className="chart-wrapper">
                        <Pie data={pieChartData} options={pieOptions} />
                    </div>
                </div>

                <div className="chart-box">
                    <h3>Tỷ Lệ Phần Trăm</h3>
                    <div className="chart-wrapper">
                        <Bar data={barChartData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="chart-summary">
                <div className="summary-item">
                    <span className="summary-label">Cảm xúc chủ đạo:</span>
                    <span className="summary-value">
                        {statistics.positive_percentage >= statistics.negative_percentage && 
                         statistics.positive_percentage >= statistics.neutral_percentage ? 
                            '😊 Tích cực' :
                         statistics.negative_percentage >= statistics.positive_percentage && 
                         statistics.negative_percentage >= statistics.neutral_percentage ?
                            '😟 Tiêu cực' : '😐 Trung tính'}
                    </span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">Độ tin cậy trung bình:</span>
                    <span className="summary-value">
                        {(statistics.average_confidence * 100).toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SentimentChart;