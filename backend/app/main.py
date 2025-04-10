import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.endpoints import auth, users, files, quizzes
from app.db.base import engine
from app.db import models

# 创建数据库表
for model in models.models:
    model.__table__.create(bind=engine, checkfirst=True)

# 确保上传目录存在
os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 设置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应该限制源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(users.router, prefix=settings.API_V1_STR, tags=["users"])
app.include_router(files.router, prefix=settings.API_V1_STR, tags=["files"])
app.include_router(quizzes.router, prefix=settings.API_V1_STR, tags=["quizzes"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AIQuiz API"}