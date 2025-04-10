# 核心功能模块包初始化文件
# 这个文件使app/core成为一个Python包

# 导入核心模块，使其可以通过app.core直接访问
from . import security
from . import llm

# 可以在这里添加核心功能相关的通用配置或初始化代码
