import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: GEMINI_API_KEY is not set in .env file.")
        
    async def interpret(self, saju_data: dict, analysis_data: dict):
        """
        Generates fortune interpretation using Google Gemini API (REST)
        """
        system_instruction = """
        당신은 한국 최고의 사주 명리학자입니다.
        주어진 사주 오행 분석 데이터를 바탕으로 2026년의 운세를 해석해주세요.
        
        [지시사항]
        1. 다음 5가지 항목으로 구성하십시오: [총운], [재물/직업운], [연애/대인관계], [건강운], [개운법].
        2. **서식 규칙 (엄격 준수)**:
           - 각 항목의 제목은 반드시 `### ` (헤더 3)를 사용하십시오. (예: ### 총운)
           - 제목 바로 다음 줄은 비워두어 간격을 확보하십시오.
           - 각 항목 사이에는 반드시 **두 줄 이상의 공백**을 두어 구분하십시오.
        3. **내용 작성 가이드**:
           - 말투: 신뢰감 있고 따뜻한 존댓말.
           - 가독성: 한 문단이 너무 길어지지 않도록 적절히 줄바꿈을 하십시오.
           - (Action Item)이라는 단어는 쓰지 말고 그냥 '개운법'이라고만 쓰십시오.
        """

        user_prompt = f"""
        사용자 사주 정보:
        {saju_data}
        
        오행 분석 결과:
        {analysis_data}
        
        위 정보를 바탕으로 2026년 운세를 상세히 풀이해주세요.
        """

        # Gemini REST API Endpoint
        # Using gemini-flash-latest for better stability
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={self.api_key}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [{
                "parts": [{"text": system_instruction + "\n\n" + user_prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 4096
            }
        }

        import time
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Using synchronous requests inside async function
                response = requests.post(url, headers=headers, json=payload, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    raw_text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    
                    if not raw_text:
                        return "AI가 답변을 생성하지 못했습니다."

                    return self._post_process(raw_text)
                
                elif response.status_code == 429:
                    print(f"Rate Limit Hit (429). Retrying in {2 ** attempt} seconds...")
                    time.sleep(2 ** attempt) # Exponential backoff: 1s, 2s, 4s
                    continue
                
                else:
                    print(f"Gemini API Error: {response.status_code} - {response.text}")
                    return f"죄송합니다. 서버 연결에 문제가 발생했습니다. (오류 코드: {response.status_code})"

            except Exception as e:
                print(f"LLM Error: {e}")
                return "죄송합니다. AI가 천기를 누설하다 잠시 멈췄습니다. (네트워크 오류)"
        
        return "죄송합니다. 사용자가 너무 많아 처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요. (429)"
    
    def _post_process(self, text: str) -> str:
        """
        Force formatting to ensure proper markdown structure.
        """
        import re
        
        # 0. Clean up user-disliked terms
        text = text.replace("(Action Item)", "").replace("(ActionItem)", "")

        # 1. Ensure headers are H3
        keywords = ["총운", "재물/직업운", "연애/대인관계", "건강운", "개운법", "총평"]
        
        for key in keywords:
            pattern = re.compile(f"(?:^|\\n)+[:#*\\s]*({re.escape(key)}[(]?.*?[)]?)(?:\\s|[*:])*([^\\n]*)", re.MULTILINE)
            text = pattern.sub(f"\n\n### \\1\n\n\\2", text)
            
        # 3. Clean up excessive newlines
        text = re.sub(r'\n{4,}', '\n\n\n', text)
        
        return text.strip()
