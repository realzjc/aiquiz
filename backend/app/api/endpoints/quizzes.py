# app/api/endpoints/quizzes.py
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path, Body
from sqlalchemy.orm import Session
from typing import List, Optional

from app.services.auth_service import AuthService
from app.db.base import get_db
from app.db.models.user import User
from app.services.quiz_service import QuizService
from app.schemas.quiz import (
    QuestionBank as QuestionBankSchema,
    QuestionBankCreate, QuestionBankUpdate,
    Question as QuestionSchema,
    QuestionCreate, QuestionUpdate,
    Quiz as QuizSchema,
    QuizCreate, QuizUpdate,
    QuizSubmissionCreate
)

router = APIRouter()

# ==================== 题库管理 ====================

@router.post("/banks", response_model=QuestionBankSchema, status_code=status.HTTP_201_CREATED)
def create_question_bank(
    bank_in: QuestionBankCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    创建题库
    
    创建一个新的题库
    
    - **name**: 题库名称
    - **description**: 题库描述（可选）
    
    返回创建的题库信息
    """
    return QuizService.create_question_bank(db, bank_in, current_user)


@router.get("/banks", response_model=List[QuestionBankSchema])
def list_question_banks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    获取题库列表
    
    获取当前用户创建的所有题库
    
    - **skip**: 跳过的记录数（分页用）
    - **limit**: 返回的最大记录数（分页用）
    
    返回题库列表
    """
    return QuizService.list_question_banks(db, current_user, skip, limit)


@router.get("/banks/{bank_id}", response_model=QuestionBankSchema)
def get_question_bank(
    bank_id: int = Path(..., title="题库ID", description="要获取的题库的ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    获取题库详情
    
    获取指定ID的题库详情
    
    - **bank_id**: 题库ID
    
    返回题库详情，包括题库中的问题
    """
    return QuizService.get_question_bank(db, bank_id, current_user)


@router.put("/banks/{bank_id}", response_model=QuestionBankSchema)
def update_question_bank(
    bank_id: int,
    bank_in: QuestionBankUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    更新题库
    
    更新指定ID的题库信息
    
    - **bank_id**: 题库ID
    - **name**: 新的题库名称（可选）
    - **description**: 新的题库描述（可选）
    
    返回更新后的题库信息
    """
    return QuizService.update_question_bank(db, bank_id, bank_in, current_user)


@router.delete("/banks/{bank_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question_bank(
    bank_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    删除题库
    
    删除指定ID的题库
    
    - **bank_id**: 题库ID
    
    无返回内容
    """
    QuizService.delete_question_bank(db, bank_id, current_user)
    return None


# ==================== 问题管理 ====================

@router.post("/banks/{bank_id}/questions", response_model=QuestionSchema, status_code=status.HTTP_201_CREATED)
def create_question(
    bank_id: int,
    question_in: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    创建问题
    
    在指定题库中创建一个新问题
    
    - **bank_id**: 题库ID
    - **prompt**: 问题内容
    - **answer**: 问题答案
    - **explanation**: 解释（可选）
    - **difficulty**: 难度（easy, medium, hard）
    - **options**: 选项列表（可选）
    
    返回创建的问题信息
    """
    return QuizService.create_question(db, bank_id, question_in, current_user)


@router.get("/banks/{bank_id}/questions", response_model=List[QuestionSchema])
def list_questions(
    bank_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    获取问题列表
    
    获取指定题库中的所有问题
    
    - **bank_id**: 题库ID
    - **skip**: 跳过的记录数（分页用）
    - **limit**: 返回的最大记录数（分页用）
    
    返回问题列表
    """
    return QuizService.list_questions(db, bank_id, current_user, skip, limit)


@router.get("/questions/{question_id}", response_model=QuestionSchema)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    获取问题详情
    
    获取指定ID的问题详情
    
    - **question_id**: 问题ID
    
    返回问题详情
    """
    return QuizService.get_question(db, question_id, current_user)


@router.put("/questions/{question_id}", response_model=QuestionSchema)
def update_question(
    question_id: int,
    question_in: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    更新问题
    
    更新指定ID的问题信息
    
    - **question_id**: 问题ID
    - **prompt**: 新的问题内容（可选）
    - **answer**: 新的问题答案（可选）
    - **explanation**: 新的解释（可选）
    - **difficulty**: 新的难度（可选）
    
    返回更新后的问题信息
    """
    return QuizService.update_question(db, question_id, question_in, current_user)


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    删除问题
    
    删除指定ID的问题
    
    - **question_id**: 问题ID
    
    无返回内容
    """
    QuizService.delete_question(db, question_id, current_user)
    return None


# ==================== 测验管理 ====================

@router.post("/quizzes", response_model=QuizSchema, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_in: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_active_user)
):
    """
    创建测验
    
    创建一个新的测验
    
    - **bank_id**: 题库ID
    - **name**: 测验名称
    - **description**: 测验描述（可选）
    - **time_limit**: 时间限制（分钟，可选）
    - **question_count**: 问题数量（可选）
    
    返回创建的测验信息
    """
    return QuizService.create_quiz(db, quiz_in, current_user)