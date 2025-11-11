"""
Script to create a dummy sentiment model for testing
Run this if you don't have a pre-trained model yet
"""
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Create dummy training data
X_train = [
    "tốt hay đẹp tuyệt vời",
    "xuất sắc thích yêu tuyệt",
    "tệ xấu dở kém",
    "ghét tồi không tốt",
    "bình thường ok ổn",
    "khá được"
]

y_train = [2, 2, 0, 0, 1, 1]  # 0: negative, 1: neutral, 2: positive

# Create a simple model
vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
model = MultinomialNB()

# Fit the vectorizer and model
X_vectorized = vectorizer.fit_transform(X_train)
model.fit(X_vectorized, y_train)

# Save the model and vectorizer
model_dir = os.path.join(os.path.dirname(__file__), 'ml_model')
os.makedirs(model_dir, exist_ok=True)

model_path = os.path.join(model_dir, 'sentiment_model.pkl')
joblib.dump({
    'model': model,
    'vectorizer': vectorizer
}, model_path)

print(f"✅ Dummy model created and saved to: {model_path}")
print("\nNote: This is a basic dummy model for testing.")
print("Replace it with your actual trained model for production use.")

# Test the model
test_comments = [
    "Video này rất hay",
    "Nội dung tệ quá",
    "Bình thường thôi"
]

print("\n🧪 Testing the model:")
for comment in test_comments:
    vec = vectorizer.transform([comment])
    pred = model.predict(vec)[0]
    proba = model.predict_proba(vec)[0]
    
    sentiment_map = {0: "Tiêu cực", 1: "Trung tính", 2: "Tích cực"}
    print(f"  '{comment}' -> {sentiment_map[pred]} (confidence: {max(proba):.2f})")
