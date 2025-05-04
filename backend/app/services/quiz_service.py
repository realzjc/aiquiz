# app/services/quiz_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime

from app.db.models.user import User
from app.db.models.quiz import (
    QuestionBank, Question, QuestionOption, QuestionStat,
    Quiz, QuizQuestion, QuizSubmission, DifficultyEnum
)
from app.schemas.quiz import (
    QuestionBankCreate, QuestionBankUpdate,
    QuestionCreate, QuestionUpdate,
    QuizCreate
)


class QuizService:
    @staticmethod
    def create_question_bank(db: Session, bank_in: QuestionBankCreate, current_user: User):
        """创建题库"""
        db_bank = QuestionBank(
            name=bank_in.name,
            description=bank_in.description,
            user_id=current_user.id
        )
        db.add(db_bank)
        db.commit()
        db.refresh(db_bank)
        
        return db_bank
    
    @staticmethod
    def list_question_banks(db: Session, current_user: User, skip: int = 0, limit: int = 100):
        """获取题库列表"""
        banks = db.query(QuestionBank).filter(
            QuestionBank.user_id == current_user.id
        ).offset(skip).limit(limit).all()
        
        return banks
    
    @staticmethod
    def get_question_bank(db: Session, bank_id: int, current_user: User):
        """获取题库详情"""
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
    
    @staticmethod
    def update_question_bank(db: Session, bank_id: int, bank_in: QuestionBankUpdate, current_user: User):
        """更新题库"""
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
    
    @staticmethod
    def delete_question_bank(db: Session, bank_id: int, current_user: User):
        """删除题库"""
        bank = db.query(QuestionBank).filter(
            QuestionBank.id == bank_id,
            QuestionBank.user_id == current_user.id
        ).first()
        
        if not bank:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="题库不存在或无权访问"
            )
        
        db.delete(bank)
        db.commit()
    
    @staticmethod
    def create_question(db: Session, bank_id: int, question_in: QuestionCreate, current_user: User):
        """创建问题"""
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
    
    @staticmethod
    def list_questions(db: Session, bank_id: int, current_user: User, skip: int = 0, limit: int = 100):
        """获取问题列表"""
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
        
        questions = db.query(Question).filter(
            Question.bank_id == bank_id
        ).offset(skip).limit(limit).all()
        
        return questions
    
    @staticmethod
    def get_question(db: Session, question_id: int, current_user: User):
        """获取问题详情"""
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
    
    @staticmethod
    def update_question(db: Session, question_id: int, question_in: QuestionUpdate, current_user: User):
        """更新问题"""
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
    
    @staticmethod
    def delete_question(db: Session, question_id: int, current_user: User):
        """删除问题"""
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
        
        db.delete(question)
        db.commit()
    
    @staticmethod
    def create_quiz(db: Session, quiz_in: QuizCreate, current_user: User):
        """创建测验"""
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