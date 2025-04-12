import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.db.base import engine
from app.db import models
from app.api import api_router

# 创建数据库表
for model in models:  # 直接使用models列表，不要访问__all__属性
    model.__table__.create(bind=engine, checkfirst=True)
    
# 确保上传目录存在
os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="aiquiz",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# 设置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载路由
app.include_router(api_router, prefix=settings.API_V1_STR)  # 👈 挂载版本前缀

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIRECTORY), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to AIQuiz API"}

@app.get("/health")
def health_check():
    """
    健康检查端点
    
    用于监控系统确认API是否正常运行
    """
    return {"status": "healthy"}