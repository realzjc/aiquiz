# app/api/endpoints/files.py
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from app.core.security import get_current_active_user
from app.db.base import get_db
from app.db.models.user import User
from app.schemas.file import File as FileSchema
from app.services.file_service import FileService
from app.core.config import settings

router = APIRouter()

@router.post("/upload", response_model=FileSchema)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    上传文件
    
    上传一个文件并保存
    
    - **file**: 要上传的文件
    
    返回上传的文件信息
    """
    return await FileService.upload_file(db, file, current_user)


@router.get("/", response_model=List[FileSchema])
def list_files(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取文件列表
    
    获取当前用户上传的所有文件
    
    - **skip**: 跳过的记录数（分页用）
    - **limit**: 返回的最大记录数（分页用）
    
    返回文件列表
    """
    return FileService.get_user_files(db, current_user, skip, limit)


@router.get("/{file_id}", response_model=FileSchema)
def get_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取文件详情
    
    获取指定ID的文件详情
    
    - **file_id**: 文件ID
    
    返回文件详情
    """
    return FileService.get_file(db, file_id, current_user)


@router.get("/download/{file_id}")
def download_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    下载文件
    
    下载指定ID的文件
    
    - **file_id**: 文件ID
    
    返回文件内容
    """
    file = FileService.get_file(db, file_id, current_user)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filepath)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在"
        )
    
    return FileResponse(
        path=file_path,
        filename=file.filename,
        media_type=file.filetype
    )


@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    删除文件
    
    删除指定ID的文件
    
    - **file_id**: 文件ID
    
    无返回内容
    """
    FileService.delete_file(db, file_id, current_user)
    return None