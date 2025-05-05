# app/api/endpoints/files.py
from fastapi import APIRouter, Depends, UploadFile, File as FastAPIFile, Query
from sqlalchemy.orm import Session
from typing import List

from app.db.base import get_db
from app.schemas.file import File as FileSchema
from app.services.file_service import FileService
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/", response_model=FileSchema)
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_active_user)
):
    """
    上传文件
    
    - **file**: 要上传的文件
    
    返回上传的文件信息
    """
    return await FileService.upload_file(db, file, current_user)

@router.get("/", response_model=List[FileSchema])
def get_user_files(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_active_user)
):
    """
    获取当前用户的文件列表
    
    - **skip**: 跳过的记录数
    - **limit**: 返回的最大记录数
    
    返回文件列表
    """
    return FileService.get_user_files(db, current_user, skip, limit)

@router.get("/{file_id}", response_model=FileSchema)
def get_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_active_user)
):
    """
    获取文件详情
    
    - **file_id**: 文件ID
    
    返回文件详情
    """
    return FileService.get_file(db, file_id, current_user)

@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(AuthService.get_current_active_user)
):
    """
    删除文件
    
    - **file_id**: 文件ID
    
    返回删除结果
    """
    return FileService.delete_file(db, file_id, current_user)