from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class DifficultyEnum(str, Enum):
    """难度枚举，与数据库模型保持一致"""
    easy = "easy"
    medium = "medium"
    hard = "hard"


class QuestionBankBase(BaseModel):
    """题库基础信息"""
    name: str
    description: Optional[str] = None


class QuestionBankCreate(QuestionBankBase):
    """创建题库请求模型"""
    user_id: int


class QuestionBankUpdate(BaseModel):
    """更新题库请求模型"""
    name: Optional[str] = None
    description: Optional[str] = None


class QuestionBase(BaseModel):
    """问题基础信息"""
    prompt: str
    answer: str
    explanation: Optional[str] = None
    difficulty: DifficultyEnum = DifficultyEnum.medium


class QuestionCreate(QuestionBase):
    """创建问题请求模型"""
    bank_id: int


class QuestionUpdate(BaseModel):
    """更新问题请求模型"""
    prompt: Optional[str] = None
    answer: Optional[str] = None
    explanation: Optional[str] = None
    difficulty: Optional[DifficultyEnum] = None


class QuestionOptionBase(BaseModel):
    """问题选项基础信息"""
    content: str
    is_correct: bool = False


class QuestionOptionCreate(QuestionOptionBase):
    """创建问题选项请求模型"""
    question_id: int


class QuestionOptionUpdate(BaseModel):
    """更新问题选项请求模型"""
    content: Optional[str] = None
    is_correct: Optional[bool] = None


class QuestionOptionInDB(QuestionOptionBase):
    """数据库中的问题选项模型"""
    id: int
    question_id: int
    
    class Config:
        orm_mode = True


class QuestionStatBase(BaseModel):
    """问题统计基础信息"""
    attempts: int = 0
    correct_attempts: int = 0


class QuestionStatCreate(QuestionStatBase):
    """创建问题统计请求模型"""
    question_id: int


class QuestionStatUpdate(BaseModel):
    """更新问题统计请求模型"""
    attempts: Optional[int] = None
    correct_attempts: Optional[int] = None


class QuestionStatInDB(QuestionStatBase):
    """数据库中的问题统计模型"""
    id: int
    question_id: int
    
    class Config:
        orm_mode = True


class QuestionInDB(QuestionBase):
    """数据库中的问题模型"""
    id: int
    bank_id: int
    created_at: datetime
    options: List[QuestionOptionInDB] = []
    stats: Optional[QuestionStatInDB] = None
    
    class Config:
        orm_mode = True


class Question(QuestionBase):
    """问题响应模型"""
    id: int
    bank_id: int
    created_at: datetime
    options: List[QuestionOptionInDB] = []
    
    class Config:
        orm_mode = True


class QuestionBankShareBase(BaseModel):
    """题库分享基础信息"""
    share_token: str
    is_public: bool = False


class QuestionBankShareCreate(BaseModel):
    """创建题库分享请求模型"""
    bank_id: int
    is_public: bool = False


class QuestionBankShareUpdate(BaseModel):
    """更新题库分享请求模型"""
    is_public: Optional[bool] = None


class QuestionBankShareInDB(QuestionBankShareBase):
    """数据库中的题库分享模型"""
    id: int
    bank_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True


class QuestionBankInDB(QuestionBankBase):
    """数据库中的题库模型"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    questions: List[Question] = []
    shares: List[QuestionBankShareInDB] = []
    
    class Config:
        orm_mode = True


class QuestionBank(QuestionBankBase):
    """题库响应模型"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    questions: List[Question] = []
    
    class Config:
        orm_mode = True


class QuizBase(BaseModel):
    """测验基础信息"""
    title: str
    duration_seconds: int
    random_order: bool = True
    allow_backtrack: bool = True


class QuizCreate(QuizBase):
    """创建测验请求模型"""
    user_id: int
    bank_id: int


class QuizUpdate(BaseModel):
    """更新测验请求模型"""
    title: Optional[str] = None
    duration_seconds: Optional[int] = None
    random_order: Optional[bool] = None
    allow_backtrack: Optional[bool] = None


class QuizQuestionBase(BaseModel):
    """测验问题基础信息"""
    sequence_index: int


class QuizQuestionCreate(QuizQuestionBase):
    """创建测验问题请求模型"""
    quiz_id: int
    question_id: int


class QuizQuestionInDB(QuizQuestionBase):
    """数据库中的测验问题模型"""
    id: int
    quiz_id: int
    question_id: int
    question: Question
    
    class Config:
        orm_mode = True


class QuizSubmissionBase(BaseModel):
    """测验提交基础信息"""
    answers: Dict[str, Any]  # JSON格式的答案
    score: float
    correct_count: int


class QuizSubmissionCreate(BaseModel):
    """创建测验提交请求模型"""
    quiz_id: int
    user_id: int
    answers: Dict[str, Any]
    score: float
    correct_count: int


class QuizSubmissionInDB(QuizSubmissionBase):
    """数据库中的测验提交模型"""
    id: int
    quiz_id: int
    user_id: int
    submission_time: datetime
    
    class Config:
        orm_mode = True


class QuizInDB(QuizBase):
    """数据库中的测验模型"""
    id: int
    user_id: int
    bank_id: int
    start_time: datetime
    quiz_questions: List[QuizQuestionInDB] = []
    submissions: List[QuizSubmissionInDB] = []
    
    class Config:
        orm_mode = True


class Quiz(QuizBase):
    """测验响应模型"""
    id: int
    user_id: int
    bank_id: int
    start_time: datetime
    quiz_questions: List[QuizQuestionInDB] = []
    
    class Config:
        orm_mode = True