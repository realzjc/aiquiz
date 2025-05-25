from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID, uuid4

class ChatRequest(BaseModel):
    """聊天请求模型"""
    message: str = Field(..., description="用户发送的消息")

class ChatResponse(BaseModel):
    """聊天响应模型"""
    message_id: str = Field(..., description="消息ID")
    conversation_id: str = Field(..., description="对话ID")
    content: str = Field(..., description="回复内容")
    created_at: str = Field(..., description="创建时间")

class MessageBase(BaseModel):
    """消息基础模型"""
    content: str = Field(..., description="消息内容")
    role: str = Field(..., description="消息角色 (user/assistant)")

class MessageResponse(MessageBase):
    """消息响应模型"""
    id: str = Field(..., description="消息ID")
    created_at: str = Field(..., description="创建时间")

class ConversationBase(BaseModel):
    """对话基础模型"""
    bank_id: int = Field(..., description="知识库ID")
    title: str = Field(..., description="对话标题")

class ConversationCreate(ConversationBase):
    """创建对话请求模型"""
    pass

class ConversationResponse(ConversationBase):
    """对话响应模型"""
    id: str = Field(..., description="对话ID")
    user_id: int = Field(..., description="用户ID")
    created_at: str = Field(..., description="创建时间")
    updated_at: str = Field(..., description="更新时间")
    messages: Optional[List[MessageResponse]] = Field(default=[], description="消息列表")

    class Config:
        orm_mode = True 