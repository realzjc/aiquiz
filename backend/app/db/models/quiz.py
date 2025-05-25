from sqlalchemy import Boolean, Column, String, Integer, DateTime, ForeignKey, JSON, Enum, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base
import enum

class DifficultyEnum(enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuestionBank(Base):
    __tablename__ = "question_banks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="question_banks")
    questions = relationship("Question", back_populates="bank", cascade="all, delete-orphan")
    shares = relationship("QuestionBankShare", back_populates="bank", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="bank", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    bank_id = Column(Integer, ForeignKey("question_banks.id", ondelete="CASCADE"))
    prompt = Column(Text)
    answer = Column(Text)
    explanation = Column(Text, nullable=True)
    difficulty = Column(Enum(DifficultyEnum), default=DifficultyEnum.medium)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bank = relationship("QuestionBank", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan")
    stats = relationship("QuestionStat", back_populates="question", uselist=False, cascade="all, delete-orphan")
    quiz_questions = relationship("QuizQuestion", back_populates="question", cascade="all, delete-orphan")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    content = Column(Text)
    is_correct = Column(Boolean, default=False)

    # Relationships
    question = relationship("Question", back_populates="options")


class QuestionStat(Base):
    __tablename__ = "question_stats"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    attempts = Column(Integer, default=0)
    correct_attempts = Column(Integer, default=0)

    # Relationships
    question = relationship("Question", back_populates="stats")


class QuestionBankShare(Base):
    __tablename__ = "question_bank_shares"

    id = Column(Integer, primary_key=True, index=True)
    bank_id = Column(Integer, ForeignKey("question_banks.id", ondelete="CASCADE"))
    share_token = Column(String, unique=True, index=True)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bank = relationship("QuestionBank", back_populates="shares")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    bank_id = Column(Integer, ForeignKey("question_banks.id", ondelete="CASCADE"))
    title = Column(String)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    duration_seconds = Column(Integer)
    random_order = Column(Boolean, default=True)
    allow_backtrack = Column(Boolean, default=True)

    # Relationships
    user = relationship("User", back_populates="quizzes")
    bank = relationship("QuestionBank", back_populates="quizzes")
    quiz_questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    submissions = relationship("QuizSubmission", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"))
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))
    sequence_index = Column(Integer)

    # Relationships
    quiz = relationship("Quiz", back_populates="quiz_questions")
    question = relationship("Question", back_populates="quiz_questions")


class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    submission_time = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Float)
    answers = Column(JSON)
    correct_count = Column(Integer)

    # Relationships
    quiz = relationship("Quiz", back_populates="submissions")
    user = relationship("User", back_populates="quiz_submissions")