# 数据库包初始化文件
# 这个文件使app/db成为一个Python包

# 导入数据库基础模块
from . import base

# 导入所有模型，使其可以通过app.db.models访问
from . import models

# 可以在这里添加数据库相关的初始化代码
# 例如：创建数据库连接池、设置数据库事件监听器等

# 导出get_db依赖函数，方便直接从app.db导入
from .base import get_db

# 定义所有模型的列表，用于自动创建表
models = [
    models.user.User,
    models.user.UserProfile,
    models.file.File,
    models.quiz.QuestionBank,
    models.quiz.Question,
    models.quiz.QuestionOption,
    models.quiz.QuestionStat,
    models.quiz.Quiz,
    models.quiz.QuizQuestion,
    models.quiz.QuizSubmission
]

__all__ = ["base", "models", "get_db"]