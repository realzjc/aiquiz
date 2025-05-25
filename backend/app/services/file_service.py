# app/services/file_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
import os
import uuid
from datetime import datetime
import shutil
from pathlib import Path

from app.db.models.user import User
from app.db.models.file import File
from app.db.models.quiz import QuestionBank
from app.config import settings

class FileService:
    @staticmethod
    async def upload_file(db: Session, file: UploadFile, bank_id: int, current_user: User):
        """上传文件到指定题库"""
        # 检查题库是否存在且属于当前用户
        bank = db.query(QuestionBank).filter(
            QuestionBank.id == bank_id,
            QuestionBank.user_id == current_user.id
        ).first()
        
        if not bank:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question bank not found or access denied"
            )
        
        # 生成唯一文件名
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
        file_name = f"{file_id}{file_extension}"
        
        # 确保上传目录存在
        upload_dir = Path(settings.UPLOAD_DIRECTORY) / str(current_user.id) / str(bank_id)
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # 保存文件
        file_path = upload_dir / file_name
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 获取文件大小
        file_size = os.path.getsize(file_path)
        
        # 创建文件记录
        db_file = File(
            id=file_id,
            user_id=current_user.id,
            bank_id=bank_id,
            filename=file.filename,
            filepath=str(file_path),
            filetype=file.content_type,
            filesize=file_size
        )
        
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
        return {
            "id": db_file.id,
            "name": db_file.filename,
            "type": db_file.filetype,
            "size": db_file.filesize,
            "created_at": db_file.created_at
        }
    
    @staticmethod
    def get_files_by_bank(db: Session, bank_id: int, current_user: User):
        """获取指定题库的所有文件"""
        # 检查题库是否存在且属于当前用户
        bank = db.query(QuestionBank).filter(
            QuestionBank.id == bank_id,
            QuestionBank.user_id == current_user.id
        ).first()
        
        if not bank:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question bank not found or access denied"
            )
        
        # 获取文件列表
        files = db.query(File).filter(
            File.bank_id == bank_id,
            File.user_id == current_user.id
        ).all()
        
        return [
            {
                "id": file.id,
                "name": file.filename,
                "type": file.filetype,
                "size": file.filesize,
                "created_at": file.created_at
            }
            for file in files
        ]
    
    @staticmethod
    def delete_file(db: Session, file_id: str, current_user: User):
        """删除文件"""
        # 查找文件
        file = db.query(File).filter(
            File.id == file_id,
            File.user_id == current_user.id
        ).first()
        
        if not file:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File not found or access denied"
            )
        
        # 删除物理文件
        try:
            os.remove(file.filepath)
        except OSError:
            # 如果文件不存在，忽略错误
            pass
        
        # 删除数据库记录
        db.delete(file)
        db.commit()
        
        return {"success": True}
    
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