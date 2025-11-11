# Sentiment Analysis System Backend

This is the backend component of the Sentiment Analysis System, built using FastAPI. The backend is responsible for handling API requests, processing data, and interacting with the MongoDB database.

## Project Structure

- **src/**: Contains the main application code.
  - **main.py**: Entry point of the FastAPI application.
  - **api/**: Contains API-related code.
    - **routes.py**: Defines API routes for sentiment analysis and data retrieval.
    - **dependencies.py**: Contains dependency functions for API routes.
  - **models/**: Contains data models for sentiment analysis and social media interactions.
    - **sentiment.py**: Defines sentiment-related data models.
    - **social_media.py**: Defines data models for social media interactions.
  - **services/**: Contains business logic and services.
    - **sentiment_analyzer.py**: Functions to analyze sentiment using the AI model.
    - **data_processor.py**: Functions for processing and cleaning social media data.
  - **database/**: Contains database interaction code.
    - **mongodb.py**: Functions for connecting to and interacting with MongoDB.
  - **config/**: Contains configuration settings.
    - **settings.py**: Configuration settings for the application.

- **ml_model/**: Contains the pre-trained AI model used for sentiment analysis.
  - **sentiment_model.pkl**: The sentiment analysis model.

- **requirements.txt**: Lists the dependencies required for the backend application.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd sentiment-analysis-system/backend
   ```

2. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```
   uvicorn src.main:app --reload
   ```

4. **Access the API**:
   Open your browser and navigate to `http://localhost:8000/docs` to view the API documentation and test the endpoints.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.