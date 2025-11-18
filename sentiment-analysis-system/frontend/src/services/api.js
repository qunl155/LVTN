import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api/v1`;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 60000, // Increased to 60 seconds for regular requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            const message = error.response.data?.detail || error.response.statusText;
            throw new Error(message);
        } else if (error.request) {
            // Request made but no response
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
        } else {
            throw new Error('Có lỗi xảy ra khi gửi yêu cầu.');
        }
    }
);

/**
 * Analyze sentiment from list of comments
 * @param {string[]} comments - Array of comment texts
 * @param {string} sourceUrl - Optional source URL
 * @param {string} sourcePlatform - Optional platform name
 * @returns {Promise} Analysis result
 */
export const analyzeSentiment = async (comments, sourceUrl = null, sourcePlatform = null) => {
    try {
        const response = await api.post('/analyze', {
            comments,
            source_url: sourceUrl,
            source_platform: sourcePlatform,
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        throw error;
    }
};

/**
 * Analyze sentiment from URL (YouTube, Facebook, etc.)
 * @param {string} url - Social media URL
 * @param {number} maxComments - Maximum comments to fetch (default 500, max 10000)
 * @returns {Promise} Analysis result
 */
export const analyzeSentimentFromUrl = async (url, maxComments = 500) => {
    try {
        // Calculate timeout based on number of comments
        // Estimate: ~0.3s per comment + 30s buffer for API calls
        const estimatedTime = (maxComments * 0.3) + 30;
        const timeout = Math.max(60000, estimatedTime * 1000); // Minimum 60s, max based on comments
        
        const response = await api.post('/analyze-url', {
            url,
            max_comments: maxComments,
        }, {
            timeout: timeout // Dynamic timeout based on comment count
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing from URL:', error);
        throw error;
    }
};

/**
 * Get analysis history
 * @param {number} limit - Number of records to fetch
 * @returns {Promise} History data
 */
export const getAnalysisHistory = async (limit = 10) => {
    try {
        const response = await api.get('/history', {
            params: { limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};

/**
 * Health check
 * @returns {Promise} Health status
 */
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('Error checking health:', error);
        throw error;
    }
};

/**
 * Get statistics
 * @returns {Promise} Statistics data
 */
export const getStatistics = async () => {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }
};

export default api;