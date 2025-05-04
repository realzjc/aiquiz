# app/services/user_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models.user import User
from app.schemas.user import UserUpdate

class UserService:
    @staticmethod
    def get_user(db: Session, user_id: int):
        """获取用户信息"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_in: UserUpdate):
        """更新用户信息"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        
        # 更新用户信息
        if user_in.name is not None:
            user.name = user_in.name
        
        if user_in.email is not None:
            # 检查邮箱是否已被其他用户使用
            existing_user = db.query(User).filter(
                User.email == user_in.email,
                User.id != user_id
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="邮箱已被其他用户使用"
                )
            user.email = user_in.email
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user