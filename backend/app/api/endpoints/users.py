# app/api/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.services.auth_service import AuthService
from app.db.base import get_db
from app.db.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate
from app.services.user_service import UserService

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(AuthService.get_current_active_user)):
    """
    获取当前用户信息
    
    返回当前登录用户的信息
    """
    return current_user


@router.put("/me", response_model=UserSchema)
def update_user_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    更新当前用户信息
    
    - **name**: 新的姓名（可选）
    - **email**: 新的邮箱（可选）
    
    返回更新后的用户信息
    """
    return UserService.update_user(db, current_user.id, user_in)