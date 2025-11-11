# Sentiment Analysis System Frontend

This project is a React.js application that serves as the frontend for a sentiment analysis system. It interacts with a FastAPI backend to analyze sentiments from social media data.

## Project Structure

- **public/**: Contains static files.
  - **index.html**: The main HTML file for the application.

- **src/**: Contains the source code for the React application.
  - **App.jsx**: The main component that sets up routing and layout.
  - **index.jsx**: The entry point that renders the App component.
  - **components/**: Contains reusable components.
    - **Dashboard.jsx**: Displays overall sentiment analysis results.
    - **SentimentChart.jsx**: Visualizes sentiment data in a chart format.
    - **DataInput.jsx**: Allows users to input data for analysis.
  - **services/**: Contains API service functions.
    - **api.js**: Functions for making API calls to the backend.
  - **styles/**: Contains CSS styles.
    - **App.css**: Styles for the application.

## Installation

To get started with the frontend, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   cd sentiment-analysis-system/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

Once the application is running, you can access it at `http://localhost:3000`. You will be able to input social media data and view sentiment analysis results.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.