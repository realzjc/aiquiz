from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# 现有的模型...

class UserResponse(BaseModel):
    """用户信息响应模型"""
    id: str
    email: EmailStr
    is_active: bool
    is_superuser: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True  # V2 中 orm_mode 改为 from_attributes 