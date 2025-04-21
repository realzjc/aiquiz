from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    """用户基础信息"""
    email: EmailStr
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    """创建用户请求模型"""
    password: str = Field(..., min_length=6)


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
        
class UserUpdate(BaseModel):
    """更新用户请求模型"""
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    """数据库中的用户模型"""
    id: int
    hashed_password: str
    created_at: datetime
    
    class Config:
        orm_mode = True


class User(UserBase):
    """用户响应模型"""
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True


class UserProfileBase(BaseModel):
    """用户配置文件基础信息"""
    display_name: Optional[str] = None
    theme_preference: str = "light"


class UserProfileCreate(UserProfileBase):
    """创建用户配置文件请求模型"""
    user_id: int


class UserProfileUpdate(UserProfileBase):
    """更新用户配置文件请求模型"""
    pass


class UserProfileInDB(UserProfileBase):
    """数据库中的用户配置文件模型"""
    id: int
    user_id: int
    last_login_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True


class Token(BaseModel):
    """令牌响应模型"""
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    """令牌载荷模型"""
    sub: Optional[int] = None
    exp: Optional[datetime] = None