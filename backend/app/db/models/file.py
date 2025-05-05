# app/db/models/file.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

class File(Base):
    """文件模型"""
    __tablename__ = "files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    filetype = Column(String, nullable=True)
    filesize = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    parsed_text = Column(Text, nullable=True)  # 添加解析文本字段
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关系
    user = relationship("User", back_populates="files")