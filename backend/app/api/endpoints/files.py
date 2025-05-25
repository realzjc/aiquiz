# app/api/endpoints/files.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.base import get_db
from app.db.models.user import User
from app.services.auth_service import AuthService
from app.services.file_service import FileService
from app.schemas.file import FileResponse

router = APIRouter()

@router.post("/upload/{bank_id}", response_model=FileResponse)
async def upload_file(
    bank_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    上传文件到指定题库
    """
    return await FileService.upload_file(db, file, bank_id, current_user)

@router.get("/bank/{bank_id}", response_model=List[FileResponse])
async def get_files_by_bank(
    bank_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    获取指定题库的所有文件
    """
    return FileService.get_files_by_bank(db, bank_id, current_user)

@router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(
    file_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    删除文件
    """
    FileService.delete_file(db, file_id, current_user)
    return None