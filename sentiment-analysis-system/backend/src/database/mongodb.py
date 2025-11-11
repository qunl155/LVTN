from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from typing import Optional, Dict, Any, List
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    
    def __init__(self, uri: str, database_name: str):
        self.uri = uri
        self.database_name = database_name
        
    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(self.uri)
            # Verify connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
            # Create indexes
            await self._create_indexes()
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    async def _create_indexes(self):
        """Create indexes for collections"""
        try:
            db = self.get_database()
            
            # Indexes for sentiment_analyses
            await db.sentiment_analyses.create_index([("analyzed_at", -1)])
            await db.sentiment_analyses.create_index([("source_url", 1)])
            await db.sentiment_analyses.create_index([("source_type", 1)])
            
            # Indexes for comments
            await db.comments.create_index([("analysis_id", 1)])
            await db.comments.create_index([("sentiment", 1)])
            await db.comments.create_index([("created_at", -1)])
            
            # Indexes for statistics
            await db.analysis_statistics.create_index([("date", -1)], unique=True)
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.warning(f"Index creation warning: {e}")
    
    async def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def get_database(self):
        """Get database instance"""
        if not self.client:
            raise Exception("Database not connected. Call connect() first.")
        return self.client[self.database_name]
    
    def get_collection(self, collection_name: str):
        """Get collection from database"""
        db = self.get_database()
        return db[collection_name]
    
    # ==================== SENTIMENT ANALYSES ====================
    
    async def save_analysis(self, analysis_data: Dict[str, Any]) -> str:
        """Save analysis result to sentiment_analyses collection"""
        try:
            collection = self.get_collection("sentiment_analyses")
            analysis_data["analyzed_at"] = datetime.utcnow()
            result = await collection.insert_one(analysis_data)
            analysis_id = str(result.inserted_id)
            logger.info(f"Analysis saved with ID: {analysis_id}")
            return analysis_id
        except Exception as e:
            logger.error(f"Failed to save analysis: {e}")
            raise
    
    async def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict]:
        """Get analysis by ID"""
        try:
            collection = self.get_collection("sentiment_analyses")
            result = await collection.find_one({"_id": ObjectId(analysis_id)})
            if result:
                result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            logger.error(f"Failed to get analysis: {e}")
            return None
    
    async def get_analysis_history(self, limit: int = 10, skip: int = 0) -> List[Dict]:
        """Get analysis history"""
        try:
            collection = self.get_collection("sentiment_analyses")
            cursor = collection.find().sort("analyzed_at", -1).skip(skip).limit(limit)
            results = await cursor.to_list(length=limit)
            
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
        except Exception as e:
            logger.error(f"Failed to get history: {e}")
            return []
    
    async def find_analysis_by_url(self, url: str) -> Optional[Dict]:
        """Find analysis by source URL"""
        try:
            collection = self.get_collection("sentiment_analyses")
            result = await collection.find_one({"source_url": url})
            if result:
                result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            logger.error(f"Failed to find analysis by URL: {e}")
            return None
    
    # ==================== COMMENTS ====================
    
    async def save_comments(self, comments: List[Dict[str, Any]]) -> List[str]:
        """Save multiple comments to comments collection"""
        try:
            collection = self.get_collection("comments")
            for comment in comments:
                comment["created_at"] = datetime.utcnow()
            
            result = await collection.insert_many(comments)
            comment_ids = [str(id) for id in result.inserted_ids]
            logger.info(f"Saved {len(comment_ids)} comments")
            return comment_ids
        except Exception as e:
            logger.error(f"Failed to save comments: {e}")
            raise
    
    async def get_comments_by_analysis(self, analysis_id: str, limit: int = 100) -> List[Dict]:
        """Get comments by analysis_id"""
        try:
            collection = self.get_collection("comments")
            cursor = collection.find({"analysis_id": analysis_id}).limit(limit)
            results = await cursor.to_list(length=limit)
            
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
        except Exception as e:
            logger.error(f"Failed to get comments: {e}")
            return []
    
    # ==================== STATISTICS ====================
    
    async def update_statistics(self, analysis_data: Dict[str, Any]):
        """Update daily statistics"""
        try:
            collection = self.get_collection("analysis_statistics")
            today = datetime.utcnow().date().isoformat()
            
            # Get current stats
            stats = await collection.find_one({"date": today})
            
            if not stats:
                stats = {
                    "date": today,
                    "total_analyses": 0,
                    "total_comments_analyzed": 0,
                    "sentiment_distribution": {
                        "positive": 0,
                        "negative": 0,
                        "neutral": 0
                    },
                    "top_topics": {},
                    "warning_count": {
                        "violence": 0,
                        "political": 0
                    },
                    "updated_at": datetime.utcnow()
                }
            
            # Update stats
            stats["total_analyses"] += 1
            stats["total_comments_analyzed"] += analysis_data.get("total_comments", 0)
            
            summary = analysis_data.get("sentiment_summary", {})
            stats["sentiment_distribution"]["positive"] += summary.get("positive", 0)
            stats["sentiment_distribution"]["negative"] += summary.get("negative", 0)
            stats["sentiment_distribution"]["neutral"] += summary.get("neutral", 0)
            
            # Update topics
            for topic in analysis_data.get("topics", []):
                stats["top_topics"][topic] = stats["top_topics"].get(topic, 0) + 1
            
            # Update warnings
            warnings = analysis_data.get("warning_flags", {})
            if warnings.get("has_violence"):
                stats["warning_count"]["violence"] += 1
            if warnings.get("has_political"):
                stats["warning_count"]["political"] += 1
            
            stats["updated_at"] = datetime.utcnow()
            
            # Upsert
            await collection.update_one(
                {"date": today},
                {"$set": stats},
                upsert=True
            )
            logger.info(f"Statistics updated for {today}")
        except Exception as e:
            logger.error(f"Failed to update statistics: {e}")
    
    async def get_statistics(self, days: int = 7) -> List[Dict]:
        """Get statistics for last N days"""
        try:
            collection = self.get_collection("analysis_statistics")
            cursor = collection.find().sort("date", -1).limit(days)
            results = await cursor.to_list(length=days)
            
            for result in results:
                result["_id"] = str(result["_id"])
            
            return results
        except Exception as e:
            logger.error(f"Failed to get statistics: {e}")
            return []
    
    async def get_total_stats(self) -> Dict[str, Any]:
        """Get total statistics"""
        try:
            db = self.get_database()
            
            # Total analyses
            total_analyses = await db.sentiment_analyses.count_documents({})
            
            # Total comments
            total_comments = await db.comments.count_documents({})
            
            # Sentiment distribution
            pipeline = [
                {"$group": {
                    "_id": "$sentiment",
                    "count": {"$sum": 1}
                }}
            ]
            sentiment_dist = {}
            async for doc in db.comments.aggregate(pipeline):
                sentiment_dist[doc["_id"]] = doc["count"]
            
            return {
                "total_analyses": total_analyses,
                "total_comments": total_comments,
                "sentiment_distribution": sentiment_dist
            }
        except Exception as e:
            logger.error(f"Failed to get total stats: {e}")
            return {}
    
    # ==================== GENERIC METHODS ====================
    
    async def insert_document(self, collection_name: str, document: Dict[Any, Any]) -> str:
        """Insert a single document"""
        collection = self.get_collection(collection_name)
        document["created_at"] = datetime.utcnow()
        result = await collection.insert_one(document)
        return str(result.inserted_id)
    
    async def insert_many_documents(self, collection_name: str, documents: List[Dict[Any, Any]]) -> List[str]:
        """Insert multiple documents"""
        collection = self.get_collection(collection_name)
        for doc in documents:
            doc["created_at"] = datetime.utcnow()
        result = await collection.insert_many(documents)
        return [str(id) for id in result.inserted_ids]
    
    async def find_document(self, collection_name: str, query: Dict[Any, Any]) -> Optional[Dict]:
        """Find a single document"""
        collection = self.get_collection(collection_name)
        document = await collection.find_one(query)
        if document and "_id" in document:
            document["_id"] = str(document["_id"])
        return document
    
    async def find_all_documents(self, collection_name: str, query: Dict[Any, Any] = None, limit: int = 100) -> List[Dict]:
        """Find all documents matching query"""
        collection = self.get_collection(collection_name)
        query = query or {}
        cursor = collection.find(query).limit(limit)
        documents = await cursor.to_list(length=limit)
        for doc in documents:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        return documents
    
    async def update_document(self, collection_name: str, query: Dict[Any, Any], update: Dict[Any, Any]) -> int:
        """Update a single document"""
        collection = self.get_collection(collection_name)
        update["updated_at"] = datetime.utcnow()
        result = await collection.update_one(query, {"$set": update})
        return result.modified_count
    
    async def delete_document(self, collection_name: str, query: Dict[Any, Any]) -> int:
        """Delete a single document"""
        collection = self.get_collection(collection_name)
        result = await collection.delete_one(query)
        return result.deleted_count
    
    async def count_documents(self, collection_name: str, query: Dict[Any, Any] = None) -> int:
        """Count documents matching query"""
        collection = self.get_collection(collection_name)
        query = query or {}
        return await collection.count_documents(query)

# Global database instance
db: Optional[MongoDB] = None

async def get_database() -> MongoDB:
    """Get database instance"""
    if db is None:
        raise Exception("Database not initialized")
    return db

async def init_db(uri: str, database_name: str):
    """Initialize database connection"""
    global db
    db = MongoDB(uri, database_name)
    await db.connect()

async def close_db():
    """Close database connection"""
    if db:
        await db.close()