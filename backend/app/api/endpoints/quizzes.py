from fastapi import APIRouter, Depends, HTTPException, status, Query, Path, Body
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime

from app.core.security import get_current_active_user
from app.db.base import get_db
from app.db.models.user import User
from app.db.models.quiz import (
    QuestionBank, Question, QuestionOption, QuestionStat, 
    Quiz, QuizQuestion, QuizSubmission, DifficultyEnum
)
from app.schemas.quiz import (
    QuestionBank as QuestionBankSchema,
    QuestionBankCreate, QuestionBankUpdate,
    Question as QuestionSchema,
    QuestionCreate, QuestionUpdate,
    QuestionOptionCreate,
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
    current_user: User = Depends(get_current_active_user)
):
    """
    创建题库
    
    创建一个新的题库
    
    - **name**: 题库名称
    - **description**: 题库描述（可选）
    
    返回创建的题库信息
    """
    # 创建题库
    db_bank = QuestionBank(
        name=bank_in.name,
        description=bank_in.description,
        user_id=current_user.id
    )
    db.add(db_bank)
    db.commit()
    db.refresh(db_bank)
    
    return db_bank


@router.get("/banks", response_model=List[QuestionBankSchema])
def list_question_banks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取题库列表
    
    获取当前用户创建的所有题库
    
    - **skip**: 跳过的记录数（分页用）
    - **limit**: 返回的最大记录数（分页用）
    
    返回题库列表
    """
    banks = db.query(QuestionBank).filter(
        QuestionBank.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return banks


@router.get("/banks/{bank_id}", response_model=QuestionBankSchema)
def get_question_bank(
    bank_id: int = Path(..., title="题库ID", description="要获取的题库的ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取题库详情
    
    获取指定ID的题库详情
    
    - **bank_id**: 题库ID
    
    返回题库详情，包括题库中的问题
    """
    bank = db.query(QuestionBank).filter(
        QuestionBank.id == bank_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="题库不存在或无权访问"
        )
    
    return bank


@router.put("/banks/{bank_id}", response_model=QuestionBankSchema)
def update_question_bank(
    bank_id: int,
    bank_in: QuestionBankUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    更新题库
    
    更新指定ID的题库信息
    
    - **bank_id**: 题库ID
    - **name**: 新的题库名称（可选）
    - **description**: 新的题库描述（可选）
    
    返回更新后的题库信息
    """
    bank = db.query(QuestionBank).filter(
        QuestionBank.id == bank_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="题库不存在或无权访问"
        )
    
    # 更新题库信息
    if bank_in.name is not None:
        bank.name = bank_in.name
    
    if bank_in.description is not None:
        bank.description = bank_in.description
    
    db.add(bank)
    db.commit()
    db.refresh(bank)
    
    return bank


@router.delete("/banks/{bank_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question_bank(
    bank_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    删除题库
    
    删除指定ID的题库
    
    - **bank_id**: 题库ID
    
    无返回内容
    """
    bank = db.query(QuestionBank).filter(
        QuestionBank.id == bank_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="题库不存在或无权访问"
        )
    
    # 删除题库
    db.delete(bank)
    db.commit()
    
    return None


# ==================== 问题管理 ====================

@router.post("/banks/{bank_id}/questions", response_model=QuestionSchema, status_code=status.HTTP_201_CREATED)
def create_question(
    bank_id: int,
    question_in: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
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
    # 检查题库是否存在且属于当前用户
    bank = db.query(QuestionBank).filter(
        QuestionBank.id == bank_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="题库不存在或无权访问"
        )
    
    # 创建问题
    db_question = Question(
        bank_id=bank_id,
        prompt=question_in.prompt,
        answer=question_in.answer,
        explanation=question_in.explanation,
        difficulty=question_in.difficulty
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    # 创建问题统计
    db_stat = QuestionStat(question_id=db_question.id)
    db.add(db_stat)
    db.commit()
    
    # 如果有选项，创建选项
    if question_in.options:
        for option_in in question_in.options:
            db_option = QuestionOption(
                question_id=db_question.id,
                content=option_in.content,
                is_correct=option_in.is_correct
            )
            db.add(db_option)
        
        db.commit()
    
    return db_question


@router.get("/banks/{bank_id}/questions", response_model=List[QuestionSchema])
def list_questions(
    bank_id: int,
    skip: int = 0,
    limit: int = 100,
    difficulty: Optional[DifficultyEnum] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取问题列表
    
    获取指定题库中的所有问题
    
    - **bank_id**: 题库ID
    - **skip**: 跳过的记录数（分页用）
    - **limit**: 返回的最大记录数（分页用）
    - **difficulty**: 按难度筛选（可选）
    
    返回问题列表
    """
    # 检查题库是否存在且属于当前用户
    bank = db.query(QuestionBank).filter(
        QuestionBank.id == bank_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="题库不存在或无权访问"
        )
    
    # 查询问题
    query = db.query(Question).filter(Question.bank_id == bank_id)
    
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    
    questions = query.offset(skip).limit(limit).all()
    
    return questions


@router.get("/questions/{question_id}", response_model=QuestionSchema)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取问题详情
    
    获取指定ID的问题详情
    
    - **question_id**: 问题ID
    
    返回问题详情，包括选项和统计信息
    """
    # 查询问题，并确保题库属于当前用户
    question = db.query(Question).join(
        QuestionBank, Question.bank_id == QuestionBank.id
    ).filter(
        Question.id == question_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="问题不存在或无权访问"
        )
    
    return question


@router.put("/questions/{question_id}", response_model=QuestionSchema)
def update_question(
    question_id: int,
    question_in: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
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
    # 查询问题，并确保题库属于当前用户
    question = db.query(Question).join(
        QuestionBank, Question.bank_id == QuestionBank.id
    ).filter(
        Question.id == question_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="问题不存在或无权访问"
        )
    
    # 更新问题信息
    if question_in.prompt is not None:
        question.prompt = question_in.prompt
    
    if question_in.answer is not None:
        question.answer = question_in.answer
    
    if question_in.explanation is not None:
        question.explanation = question_in.explanation
    
    if question_in.difficulty is not None:
        question.difficulty = question_in.difficulty
    
    db.add(question)
    db.commit()
    db.refresh(question)
    
    return question


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    删除问题
    
    删除指定ID的问题
    
    - **question_id**: 问题ID
    
    无返回内容
    """
    # 查询问题，并确保题库属于当前用户
    question = db.query(Question).join(
        QuestionBank, Question.bank_id == QuestionBank.id
    ).filter(
        Question.id == question_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="问题不存在或无权访问"
        )
    
    # 删除问题
    db.delete(question)
    db.commit()
    
    return None


# ==================== 测验管理 ====================

@router.post("/quizzes", response_model=QuizSchema, status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_in: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
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
    # 检查题库是否存在且属于当前用户
    bank = db.query(QuestionBank).filter(
        QuestionBank.id == quiz_in.bank_id,
        QuestionBank.user_id == current_user.id
    ).first()
    
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="题库不存在或无权访问"
        )
    
    # 创建测验
    db_quiz = Quiz(
        user_id=current_user.id,
        bank_id=quiz_in.bank_id,
        name=quiz_in.name,
        description=quiz_in.description,
        time_limit=quiz_in.time_limit,
        question_count=quiz_in.question_count,
        start_time=datetime.now()
    )
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    
    # 如果指定了问题数量，随机选择问题
    if quiz_in.question_count:
        # 获取题库中的问题
        questions = db.query(Question).filter(
            Question.bank_id == quiz_in.bank_id
        ).order_by(
            # 随机排序
            db.func.random()
        ).limit(quiz_in.question_count).all()
        
        # 添加问题到测验
        for i, question in enumerate(questions):
            db_quiz_question = QuizQuestion(
                quiz_id=db_quiz.id,
                question_id=question.id,
                order=i + 1
            )
            db.add(db_quiz_question)
        
        db.commit()
    
    return db_quiz


@router.get("/quizzes", response_model=List[QuizSchema])
def list_quizzes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取测验列表
    
    获取当前用户创建的所有测验
    
    - **skip**: 跳过的记录数（分页用）
    - **limit**: 返回的最大记录数（分页用）
    
    返回测验列表
    """
    quizzes = db.query(Quiz).filter(
        Quiz.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return quizzes


@router.get("/quizzes/{quiz_id}", response_model=QuizSchema)
def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    获取测验详情
    
    获取指定ID的测验详情
    
    - **quiz_id**: 测验ID
    
    返回测验详情，包括测验中的问题
    """
    quiz = db.query(Quiz).filter(
        Quiz.id == quiz_id,
        Quiz.user_id == current_user.id
    ).first()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="测验不存在或无权访问"
        )
    
    return quiz


@router.post("/quizzes/{quiz_id}/submit", status_code=status.HTTP_200_OK)
def submit_quiz(
    quiz_id: int,
    submission_in: QuizSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    提交测验答案
    
    提交指定测验的答案
    
    - **quiz_id**: 测验ID
    - **answers**: 答案字典，键为问题ID，值为用户答案
    
    返回评分结果
    """
    # 检查测验是否存在且属于当前用户
    quiz = db.query(Quiz).filter(
        Quiz.id == quiz_id,
        Quiz.user_id == current_user.id
    ).first()
    
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="测验不存在或无权访问"
        )
    
    # 获取测验中的问题
    quiz_questions = db.query(QuizQuestion).filter(
        QuizQuestion.quiz_id == quiz_id
    ).all()
    
    if not quiz_questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="测验中没有问题"
        )
    
    # 计算得分
    total_questions = len(quiz_questions)
    correct_answers = 0
    
    for quiz_question in quiz_questions:
        question_id = quiz_question.question_id
        user_answer = submission_in.answers.get(str(question_id))
        
        if user_answer is None:
            continue
        
        # 获取问题
        question = db.query(Question).filter(Question.id == question_id).first()
        
        if not question:
            continue
        
        # 检查答案是否正确
        is_correct = user_answer.lower() == question.answer.lower()
        
        if is_correct:
            correct_answers += 1
        
        # 创建提交记录
        db_submission = QuizSubmission(
            quiz_id=quiz_id,
            question_id=question_id,
            user_answer=user_answer,
            is_correct=is_correct
        )
        db.add(db_submission)
        
        # 更新问题统计
        question_stat = db.query(QuestionStat).filter(
            QuestionStat.question_id == question_id
        ).first()
        
        if question_stat:
            question_stat.total_attempts += 1
            if is_correct:
                question_stat.correct_attempts += 1
            db.add(question_stat)
    
    db.commit()
    
    # 计算得分百分比
    score_percentage = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    
    return {
        "quiz_id": quiz_id,
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "score_percentage": score_percentage
    }