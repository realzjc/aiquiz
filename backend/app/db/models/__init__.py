from .user import User, UserProfile, OAuthAccount
from .quiz import (
    QuestionBank, Question, QuestionOption, QuestionStat, QuestionBankShare,
    Quiz, QuizQuestion, QuizSubmission, DifficultyEnum
)
from .file import Document

# For Alembic to detect models
__all__ = [
    "User", "UserProfile", "OAuthAccount",
    "QuestionBank", "Question", "QuestionOption", "QuestionStat", "QuestionBankShare",
    "Quiz", "QuizQuestion", "QuizSubmission", "DifficultyEnum",
    "Document"
]