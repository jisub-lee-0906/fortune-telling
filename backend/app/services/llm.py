import ollama
from fastapi import HTTPException

class LLMService:
    def __init__(self):
        self.client = ollama.AsyncClient()

    async def interpret(self, saju_data: dict, analysis_data: dict):
        """
        Generates fortune interpretation using Ollama (Exaone 3.5 7.8B)
        """
        
        system_prompt = """
        당신은 한국 최고의 사주 명리학자입니다.
        주어진 사주 오행 분석 데이터를 바탕으로 2026년의 운세를 해석해주세요.
        
        [지시사항]
        1. 다음 5가지 항목으로 나누어 해석하십시오: [총운], [재물/직업운], [연애/대인관계], [건강운], [개운법(Action Item)].
        2. 각 항목은 '### ' (헤더 3)를 사용하여 명확히 구분하십시오.
        3. 말투는 신뢰감 있고 편안한 존댓말을 사용하십시오.
        4. 답변은 반드시 '한글'로만 작성해야 합니다. 영어를 절대 섞어 쓰지 마십시오.
        5. 긴 줄글보다는 글머리 기호(-)를 사용하여 가독성을 높이십시오.
        """
        
        user_prompt = analysis_data['summary_for_llm']

        try:
            response = await self.client.generate(
                model="exaone3.5:7.8b",
                prompt=user_prompt,
                system=system_prompt,
                options={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_ctx": 4096
                }
            )
            return response['response']
        except Exception as e:
            print(f"LLM Error: {e}")
            return "죄송합니다. AI가 운세를 분석하는 도중 명상을 멈췄습니다. (서버 연결 확인 필요)"
