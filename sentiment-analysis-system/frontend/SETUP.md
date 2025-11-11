# Frontend Setup Guide

## 📦 Installation

### 1. Install Node.js

Download and install from: https://nodejs.org/ (LTS version)

### 2. Install Dependencies

```bash
cd frontend
npm install
```

If you get errors:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3. Configure Environment

Create `.env` file in frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000
```

### 4. Start Development Server

```bash
npm start
```

Application will open at: http://localhost:3000

## 🎨 Project Structure

```
frontend/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── index.jsx            # Entry point
│   ├── App.jsx              # Main App component
│   ├── components/
│   │   ├── Dashboard.jsx    # Results dashboard
│   │   ├── DataInput.jsx    # Input form
│   │   └── SentimentChart.jsx  # Charts
│   ├── services/
│   │   └── api.js           # API client
│   └── styles/
│       └── App.css          # Styles
├── package.json
└── Dockerfile
```

## 🧪 Testing

### Run tests
```bash
npm test
```

### Build for production
```bash
npm run build
```

The build folder will contain optimized production files.

## 🎯 Features

### Data Input Component
- Manual comment input
- URL analysis (YouTube)
- Form validation
- Error handling

### Dashboard Component
- Overall sentiment display
- Statistics cards
- Content warnings
- Recommendations
- Comment details

### Chart Component
- Pie chart (sentiment distribution)
- Bar chart (percentages)
- Interactive tooltips

## 🔧 Development

### Adding New Features

1. **New Component:**
```jsx
// src/components/MyComponent.jsx
import React from 'react';

const MyComponent = ({ data }) => {
    return <div>{/* your code */}</div>;
};

export default MyComponent;
```

2. **New API Call:**
```javascript
// src/services/api.js
export const myNewApiCall = async (params) => {
    const response = await api.post('/endpoint', params);
    return response.data;
};
```

3. **New Style:**
```css
/* src/styles/App.css */
.my-new-class {
    /* your styles */
}
```

### Code Style

- Use functional components with hooks
- Use arrow functions
- PropTypes for type checking
- Consistent naming (camelCase)

## 🐛 Troubleshooting

### "Module not found"
```bash
npm install
```

### Port 3000 already in use
The app will prompt to use another port (3001)

Or manually kill process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Cannot connect to backend
- Check backend is running at http://localhost:8000
- Verify `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

### Chart not displaying
```bash
npm install chart.js react-chartjs-2
```

## 📦 Available Scripts

### `npm start`
Runs the app in development mode

### `npm test`
Launches the test runner

### `npm run build`
Builds the app for production

### `npm run eject`
**Note: this is a one-way operation!**

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

Update these in your hosting platform:
```
REACT_APP_API_URL=https://your-api-domain.com
```

## 🎨 Customization

### Change Theme Colors

Edit `src/styles/App.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #4CAF50;
    --danger-color: #f44336;
    --warning-color: #FFC107;
}
```

### Add New Platform Support

1. Update API service
2. Add platform detection
3. Update UI components

## 📱 Responsive Design

The app is responsive and works on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px+)

## 🔒 Security

- API calls use HTTPS in production
- Input validation
- XSS protection (React default)
- CSRF protection via backend

## 📊 Performance

- Code splitting
- Lazy loading
- Optimized images
- Minified production build

## 📞 Support

For issues:
1. Check browser console
2. Verify backend is running
3. Check network tab in DevTools
4. Review error messages
