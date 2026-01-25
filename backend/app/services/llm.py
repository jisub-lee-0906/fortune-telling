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
        1. 다음 5가지 항목으로 구성하십시오: [총운], [재물/직업운], [연애/대인관계], [건강운], [개운법].
        2. **서식 규칙 (엄격 준수)**:
           - 각 항목의 제목은 반드시 `### ` (헤더 3)를 사용하십시오. (예: ### 총운)
           - 제목 바로 다음 줄은 비워두어 간격을 확보하십시오.
           - 각 항목 사이에는 반드시 **두 줄 이상의 공백**을 두어 구분하십시오.
        3. **내용 작성 가이드**:
           - 말투: 신뢰감 있고 따뜻한 존댓말.
           - 가독성: 한 문단이 너무 길어지지 않도록 적절히 줄바꿈을 하십시오.
        4. **출력 예시 포맷**:
           
           ### 총운
           
           2026년의 전체적인 흐름은... (내용)
           
           
           ### 재물/직업운
           
           재물운은... (내용)
           
           직업적으로는... (내용)
           
           (이와 같은 형식으로 계속)
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
            raw_text = response['response']
            return self._post_process(raw_text)
        except Exception as e:
            print(f"LLM Error: {e}")
            return "죄송합니다. AI가 운세를 분석하는 도중 명상을 멈췄습니다. (서버 연결 확인 필요)"

    def _post_process(self, text: str) -> str:
        """
        Force formatting to ensure proper markdown structure.
        """
        import re
        
        # 0. Clean up user-disliked terms
        text = text.replace("(Action Item)", "").replace("(ActionItem)", "")

        # 1. Ensure headers are H3
        # Keywords to look for
        keywords = ["총운", "재물/직업운", "연애/대인관계", "건강운", "개운법", "총평"]
        
        for key in keywords:
            # Pattern: 
            # 1. Start of line/text
            # 2. Optional prefixes (###, *, space, :)
            # 3. Main Keyword (Group 1)
            # 4. Optional separators (space, :, *)
            # 5. Remaining text on the same line (Group 2)
            pattern = re.compile(f"(?:^|\\n)+[:#*\\s]*({re.escape(key)}[(]?.*?[)]?)(?:\\s|[*:])*([^\\n]*)", re.MULTILINE)
            
            # Replace with:
            # \n\n### Keyword\n\nRest of line
            text = pattern.sub(f"\n\n### \\1\n\n\\2", text)
            
        # 2. Add bullet points for Action Items if missing (simple heuristic)
        # If a line in Action Items starts without a bullet, add one? (Optional, skipping for now to avoid over-engineering)

        # 3. Clean up excessive newlines (max 3)
        text = re.sub(r'\n{4,}', '\n\n\n', text)
        
        return text.strip()
