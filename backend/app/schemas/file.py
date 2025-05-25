from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FileBase(BaseModel):
    """文件基础信息"""
    filename: str
    filepath: str
    filetype: Optional[str] = None
    filesize: Optional[int] = None


class FileCreate(FileBase):
    """文件创建模型"""
    pass


class FileUpdate(BaseModel):
    """文件更新模型"""
    filename: Optional[str] = None
    parsed_text: Optional[str] = None


class FileInDB(FileBase):
    """数据库中的文件模型"""
    id: int
    user_id: int
    parsed_text: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True  # 替换 orm_mode = True


class File(FileBase):
    """文件响应模型"""
    id: int
    user_id: int
    parsed_text: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True  # 替换 orm_mode = True


class FileResponse(BaseModel):
    id: str
    name: str
    type: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True