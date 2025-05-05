# app/llm/__init__.py
"""
LLM 模块

这个模块包含与大型语言模型(LLM)交互的功能，包括:
- 基础LLM客户端
- RAG (检索增强生成)实现
- 提示模板管理
- 上下文处理
"""

from app.llm.client import LLMClient

__all__ = [
    "LLMClient",
]