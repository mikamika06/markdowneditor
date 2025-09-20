from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Boolean, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime, timezone



class AISettings(Base):
    __tablename__ = "ai_settings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    preferred_provider = Column(String(50), default="ollama")
    api_keys = Column(JSON, default={})  # {"openai": "key", "groq": "key"}
    settings = Column(JSON, default={})  # {"temperature": 0.7, "max_tokens": 1000}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="ai_settings")


class DocumentVersion(Base):
    __tablename__ = "document_versions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_id = Column(Integer, ForeignKey("notes.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    content_hash = Column(String(64))  
    change_description = Column(String(255))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_auto_save = Column(Boolean, default=True)
    
    note = relationship("Note")
    user = relationship("User")


class AIUsageLog(Base):
    __tablename__ = "ai_usage_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    operation_type = Column(String(50), nullable=False)  # autocomplete, translate, etc
    provider = Column(String(50), nullable=False)  # ollama, openai, groq
    tokens_used = Column(Integer, default=0)
    execution_time = Column(Float) #seconds
    success = Column(Boolean, default=True)
    error_message = Column(Text)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User")


class ExportHistory(Base):
    __tablename__ = "export_history"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_id = Column(Integer, ForeignKey("notes.id"), nullable=False)
    format = Column(String(10), nullable=False)  # pdf, docx, html
    file_path = Column(String(500))
    file_size = Column(Integer) 
    export_settings = Column(JSON, default={})
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    download_count = Column(Integer, default=0)
    
    note = relationship("Note")
    user = relationship("User")

