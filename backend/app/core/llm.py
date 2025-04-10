import requests
import json
from typing import List, Dict, Any, Optional

from app.config import settings

class LLMClient:
    """
    用于与LLM API交互的客户端
    """
    
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.LLM_API_KEY
        self.model = model or settings.LLM_MODEL
        self.base_url = "https://api.openai.com/v1"  # 默认使用OpenAI
        
    def generate_questions(self, content: str, num_questions: int = 5, question_type: str = "multiple_choice") -> List[Dict[str, Any]]:
        """
        根据内容生成问题
        """
        if not self.api_key:
            raise ValueError("LLM API key not set")
        
        prompt = f"""
        基于以下内容生成{num_questions}道{question_type}类型的问题。
        每个问题应包含问题内容、选项（如适用）、正确答案和解释。
        以JSON格式输出。
        
        内容：
        {content}
        """
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }
        
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers=headers,
            data=json.dumps(data)
        )
        
        if response.status_code != 200:
            raise Exception(f"LLM API error: {response.text}")
        
        result = response.json()
        content = result["choices"][0]["message"]["content"]
        
        try:
            questions = json.loads(content)
            return questions
        except json.JSONDecodeError:
            # 如果结果不是有效的JSON，尝试提取JSON部分
            import re
            json_match = re.search(r'```json\n(.*?)\n```', content, re.DOTALL)
            if json_match:
                questions = json.loads(json_match.group(1))
                return questions
            raise ValueError("Failed to parse LLM response as JSON")