# app/services/file_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
import os
import uuid
from datetime import datetime

from app.db.models.user import User
from app.db.models.file import File
from app.config import Settings

class FileService:
    @staticmethod
    async def upload_file(db: Session, file: UploadFile, current_user: User):
        """上传文件"""
        # 创建上传目录（如果不存在）
        os.makedirs(Settings.UPLOAD_DIRECTORY, exist_ok=True)
        
        # 生成唯一文件名
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(Settings.UPLOAD_DIRECTORY, unique_filename)
        
        # 保存文件
        try:
            contents = await file.read()
            with open(file_path, "wb") as f:
                f.write(contents)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"文件上传失败: {str(e)}"
            )
        
        # 创建文件记录
        db_file = File(
            filename=file.filename,
            filepath=unique_filename,
            filetype=file.content_type,
            filesize=len(contents),
            user_id=current_user.id
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
        return db_file
    
    @staticmethod
    def get_user_files(db: Session, current_user: User, skip: int = 0, limit: int = 100):
        """获取用户文件列表"""
        files = db.query(File).filter(
            File.user_id == current_user.id
        ).offset(skip).limit(limit).all()
        
        return files
    
    @staticmethod
    def get_file(db: Session, file_id: int, current_user: User):
        """获取文件详情"""
        file = db.query(File).filter(
            File.id == file_id,
            File.user_id == current_user.id
        ).first()
        
        if not file:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文件不存在或无权访问"
            )
        
        return file
    
    @staticmethod
    def delete_file(db: Session, file_id: int, current_user: User):
        """删除文件"""
        file = db.query(File).filter(
            File.id == file_id,
            File.user_id == current_user.id
        ).first()
        
        if not file:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文件不存在或无权访问"
            )
        
        # 删除物理文件
        try:
            file_path = os.path.join(Settings.UPLOAD_DIRECTORY, file.filepath)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            # 记录错误但继续删除数据库记录
            print(f"删除文件失败: {str(e)}")
        
        # 删除数据库记录
        db.delete(file)
        db.commit()
        
        return {"success": True}
    
    @staticmethod
    def update_file(db: Session, file_id: int, file_update, current_user: User):
        """更新文件信息"""
        file = db.query(File).filter(
            File.id == file_id,
            File.user_id == current_user.id
        ).first()
        
        if not file:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="文件不存在或无权访问"
            )
        
        # 更新文件信息
        update_data = file_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(file, key, value)
        
        db.commit()
        db.refresh(file)
        
        return file