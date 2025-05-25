# API包初始化文件
# 这个文件使app/api成为一个Python包

# 可以在这里添加API相关的通用功能或配置
# 例如：API版本控制、全局中间件等

# 导入endpoints子包，使其可以通过app.api.endpoints访问
from fastapi import APIRouter
from app.api.endpoints import auth, users, files, quizzes, chat

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])