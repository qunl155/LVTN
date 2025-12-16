import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const SentimentChart = ({ data }) => {
    if (!data || !data.statistics) {
        return null;
    }

    const { statistics } = data;

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
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(234, 179, 8, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

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
                    'rgba(34, 197, 94, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(234, 179, 8, 0.6)',
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(234, 179, 8, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
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
                    font: { size: 14, family: 'Inter' },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                titleFont: { size: 14, family: 'Inter' },
                bodyFont: { size: 13, family: 'Inter' },
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
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
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                    font: { family: 'Inter' },
                    callback: function (value) { return value + '%'; }
                }
            },
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', weight: 500 } }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return context.parsed.y.toFixed(1) + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-900">Thống Kê Chi Tiết</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            Phân Bố Cảm Xúc
                        </h3>
                    </div>
                    <div className="h-64">
                        <Pie data={pieChartData} options={pieOptions} />
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Tỷ Lệ Phần Trăm
                        </h3>
                    </div>
                    <div className="h-64">
                        <Bar data={barChartData} options={barOptions} />
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                        <span className="text-4xl mb-2">
                            {statistics.positive_percentage >= statistics.negative_percentage &&
                                statistics.positive_percentage >= statistics.neutral_percentage ? '' :
                                statistics.negative_percentage >= statistics.positive_percentage &&
                                    statistics.negative_percentage >= statistics.neutral_percentage ? '' : ''}
                        </span>
                        <span className="text-sm text-slate-400 mb-1">Cảm xúc chủ đạo</span>
                        <span className="text-xl font-bold">
                            {statistics.positive_percentage >= statistics.negative_percentage &&
                                statistics.positive_percentage >= statistics.neutral_percentage ? 'Tích cực' :
                                statistics.negative_percentage >= statistics.positive_percentage &&
                                    statistics.negative_percentage >= statistics.neutral_percentage ? 'Tiêu cực' : 'Trung tính'}
                        </span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                        <span className="text-4xl mb-2"></span>
                        <span className="text-sm text-slate-400 mb-1">Tổng bình luận</span>
                        <span className="text-xl font-bold">{statistics.total_comments}</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg">
                        <span className="text-4xl mb-2"></span>
                        <span className="text-sm text-slate-400 mb-1">Độ tin cậy TB</span>
                        <span className="text-xl font-bold">{(statistics.average_confidence * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentimentChart;