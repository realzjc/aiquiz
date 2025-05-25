from .user import User, UserProfile, OAuthAccount
from .quiz import (
    QuestionBank, Question, QuestionOption, QuestionStat, QuestionBankShare,
    Quiz, QuizQuestion, QuizSubmission, DifficultyEnum
)
from .file import File

# 导出 Base
from app.db.base import Base

# For Alembic to detect models
__all__ = [
    "User", "UserProfile", "OAuthAccount",
    "QuestionBank", "Question", "QuestionOption", "QuestionStat", "QuestionBankShare",
    "Quiz", "QuizQuestion", "QuizSubmission", "DifficultyEnum",
    "File",
    "Conversation", "Message"
]