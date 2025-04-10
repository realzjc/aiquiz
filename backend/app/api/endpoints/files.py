from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import shutil
from typing import List

from app.core.security import get_current_active_user
from app.db.base import get_db
from app.db.models.user import User
from app.db.models.file import Document
from app.schemas.file import Document as DocumentSchema, DocumentCreate
from app.config import settings

router = APIRouter()

@router.post("/upload", response_model=DocumentSchema, status_code=status.HTTP_201_CREATED)
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    上传文件
    
    上传文件并保存到服务器
    
    - **file**: 要上传的文件
    
    返回上传的文件信息
    """
    # 检查文件大小
    file_size = 0
    file.file.seek(0, 2)  # 移动到文件末尾
    file_size = file.file.tell()  # 获取文件大小
    file.file.seek(0)  # 重置文件指针
    
    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"文件大小超过限制（最大 {settings.MAX_UPLOAD_SIZE / (1024 * 1024)} MB）"
        )
    
    # 创建用户目录
    user_upload_dir = os.path.join(settings.UPLOAD_DIRECTORY, str(current_user.id))
    os.makedirs(user_upload_dir, exist_ok=True)
    
    # 保存文件
    file_path = os.path.join(user_upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 创建文档记录
    db_document = Document(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document


@router.get("/", response_model=List[DocumentSchema])
def list_files(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    列出文件
    
    获取当前用户上传的所有文件
    
    - **skip**: 跳过的记录数（分页用）
    - **limit**: 返回的最大记录数（分页用）
    
    返回文件列表
    """
    documents = db.query(Document).filter(
        Document.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return documents


@router.get("/{document_id}", response_model=DocumentSchema)
def get_file(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取文件信息
    
    获取指定ID的文件信息
    
    - **document_id**: 文件ID
    
    返回文件信息
    """
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在或无权访问"
        )
    
    return document


@router.get("/download/{document_id}")
def download_file(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    下载文件
    
    下载指定ID的文件
    
    - **document_id**: 文件ID
    
    返回文件内容
    """
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在或无权访问"
        )
    
    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件已被删除"
        )
    
    return FileResponse(
        path=document.file_path,
        filename=document.filename,
        media_type="application/octet-stream"
    )


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    删除文件
    
    删除指定ID的文件
    
    - **document_id**: 文件ID
    
    无返回内容
    """
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在或无权访问"
        )
    
    # 删除文件记录
    db.delete(document)
    db.commit()
    
    # 删除实际文件
    if os.path.exists(document.file_path):
        os.remove(document.file_path)