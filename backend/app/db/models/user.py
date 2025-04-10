from sqlalchemy import Boolean, Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    oauth_accounts = relationship("OAuthAccount", back_populates="user")
    question_banks = relationship("QuestionBank", back_populates="user")
    quizzes = relationship("Quiz", back_populates="user")
    quiz_submissions = relationship("QuizSubmission", back_populates="user")
    documents = relationship("Document", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    display_name = Column(String)
    theme_preference = Column(String, default="light")
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="profile")


class OAuthAccount(Base):
    __tablename__ = "oauth_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    provider = Column(String)  # e.g., google, onedrive
    account_email = Column(String)
    access_token = Column(String)
    refresh_token = Column(String)

    # Relationships
    user = relationship("User", back_populates="oauth_accounts")