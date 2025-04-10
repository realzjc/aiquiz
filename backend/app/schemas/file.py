from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentBase(BaseModel):
    """文档基础信息"""
    filename: str
    file_path: str


class DocumentCreate(DocumentBase):
    """创建文档请求模型"""
    user_id: int


class DocumentUpdate(BaseModel):
    """更新文档请求模型"""
    filename: Optional[str] = None
    file_path: Optional[str] = None
    parsed_text: Optional[str] = None


class DocumentInDB(DocumentBase):
    """数据库中的文档模型"""
    id: int
    user_id: int
    parsed_text: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True


class Document(DocumentBase):
    """文档响应模型"""
    id: int
    user_id: int
    parsed_text: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True