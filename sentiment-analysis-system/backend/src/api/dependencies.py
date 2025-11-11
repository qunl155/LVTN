from fastapi import Depends, HTTPException
from pydantic import BaseModel
from .database.mongodb import get_database

class SentimentRequest(BaseModel):
    text: str

async def get_db():
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    return db

def validate_sentiment_request(request: SentimentRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text field is required")