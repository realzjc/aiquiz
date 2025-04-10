from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_active_user, get_password_hash
from app.db.base import get_db
from app.db.models.user import User, UserProfile
from app.schemas.user import User as UserSchema, UserUpdate, UserProfileUpdate

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    获取当前用户
    
    返回当前登录用户的信息
    """
    return current_user


@router.put("/me", response_model=UserSchema)
def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    更新当前用户
    
    更新当前登录用户的信息
    
    - **email**: 新的邮箱地址（可选）
    - **password**: 新的密码（可选）
    - **is_active**: 是否激活账号（可选）
    
    返回更新后的用户信息
    """
    # 更新用户信息
    if user_in.email is not None:
        # 检查新邮箱是否已被使用
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="该邮箱已被其他用户使用"
            )
        current_user.email = user_in.email
    
    if user_in.password is not None:
        current_user.hashed_password = get_password_hash(user_in.password)
    
    if user_in.is_active is not None:
        current_user.is_active = user_in.is_active
    
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/profile", response_model=UserProfileUpdate)
def read_user_profile(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    获取用户配置文件
    
    返回当前登录用户的配置文件信息
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        # 如果用户没有配置文件，创建一个默认的
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("/me/profile", response_model=UserProfileUpdate)
def update_user_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    更新用户配置文件
    
    更新当前登录用户的配置文件信息
    
    - **display_name**: 显示名称（可选）
    - **theme_preference**: 主题偏好（可选）
    
    返回更新后的配置文件信息
    """
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        # 如果用户没有配置文件，创建一个新的
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # 更新配置文件信息
    if profile_in.display_name is not None:
        profile.display_name = profile_in.display_name
    
    if profile_in.theme_preference is not None:
        profile.theme_preference = profile_in.theme_preference
    
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile