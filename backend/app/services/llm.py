import os
import requests
import json
from dotenv import load_dotenv
from app.utils.text_formatter import format_fortune_markdown

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
        주어진 사용자의 사주 원국(오행 분포, 일간)과 2026년 병오년(세운) 데이터를 바탕으로 심층적인 통변(운세 해석)을 제공해주세요.
        단순히 좋은 말만 하는 것이 아니라, 병오(화 기운)가 사용자의 사주(일간 및 오행)에 미치는 생극제화(상생/상극) 영향을 구체적으로 분석하여 답변해야 합니다.
        
        [지시사항]
        1. 다음 5가지 항목으로 구성하십시오: [총운], [재물/직업운], [연애/대인관계], [건강운], [개운법].
        2. **서식 규칙 (엄격 준수)**:
           - 각 항목의 제목은 반드시 `### ` (헤더 3)를 사용하십시오. (예: ### 총운)
           - 제목 바로 다음 줄은 비워두어 간격을 확보하십시오.
           - 각 항목 사이에는 반드시 **두 줄 이상의 공백**을 두어 구분하십시오.
        3. **내용 작성 가이드**:
           - 2026년 병오년의 특성과 사용자의 사주 원국 조합이 어떻게 작용하는지 논리적 근거를 설명하십시오.
           - 말투: 신뢰감 있고 따뜻한 존댓말.
           - 가독성: 한 문단이 너무 길어지지 않도록 적절히 줄바꿈을 하십시오.
           - (Action Item)이라는 단어는 쓰지 말고 그냥 '개운법'이라고만 쓰십시오.
           - 없는 정보를 지어내지(환각) 마십시오. 제공된 오행 분석 결과와 2026년 운세에 근거해서만 작성해야 합니다.
        """

        user_prompt = f"""
        사용자 사주 정보:
        {saju_data}
        
        오행 분석 결과:
        {analysis_data}
        
        위 정보를 바탕으로 2026년 운세를 상세히 풀이해주세요.
        """

        # Gemini REST API Endpoint
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

        import asyncio
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Run the blocking requests.post in a separate thread
                response = await asyncio.to_thread(
                    requests.post, url, headers=headers, json=payload, timeout=15
                )
                
                if response.status_code == 200:
                    result = response.json()
                    raw_text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    
                    if not raw_text:
                        return "AI가 답변을 생성하지 못했습니다."

                    return format_fortune_markdown(raw_text)
                
                elif response.status_code == 429:
                    print(f"Rate Limit Hit (429). Retrying in {2 ** attempt} seconds...")
                    await asyncio.sleep(2 ** attempt)
                    continue
                
                else:
                    print(f"Gemini API Error: {response.status_code} - {response.text}")
                    return f"죄송합니다. 서버 연결에 문제가 발생했습니다. (오류 코드: {response.status_code})"

            except Exception as e:
                print(f"LLM Error on attempt {attempt}: {e}")
                if attempt < max_retries - 1:
                    await asyncio.sleep(1)
                    continue
                return "죄송합니다. AI가 천기를 누설하다 잠시 멈췄습니다. (네트워크/타임아웃 오류)"
        
        return "죄송합니다. 사용자가 많아 처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요. (429)"

