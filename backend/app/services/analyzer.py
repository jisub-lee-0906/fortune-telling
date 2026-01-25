from app.core.constants import GAN_PROPERTIES, JI_PROPERTIES

class AnalysisService:
    def __init__(self):
        # Use centralized constants
        self.GAN_INFO = GAN_PROPERTIES
        self.JI_INFO = JI_PROPERTIES

    def analyze(self, saju_data):
        """
        Input: {'year': '갑자년', 'month': '을축월', ...}
        Output: Structured analysis
        """
        # Cleanup Suffixes for robust parsing
        year = saju_data['year'].replace("년", "").strip()
        month = saju_data['month'].replace("월", "").strip()
        day = saju_data['day'].replace("일", "").strip()
        hour = saju_data['hour'].replace("시", "").strip()
        
        pillars = [year, month, day, hour]
        
        elements = {"Wood": 0, "Fire": 0, "Earth": 0, "Metal": 0, "Water": 0}
        chars = []
        
        # Parse characters
        for p in pillars:
            if len(p) < 2: continue # Safety check
            stem, branch = p[0], p[1]
            chars.append({'char': stem, 'type': 'gan', **self.GAN_INFO.get(stem, {})})
            chars.append({'char': branch, 'type': 'ji', **self.JI_INFO.get(branch, {})})
            
            # Count elements
            stem_el = self.GAN_INFO.get(stem, {}).get('element')
            branch_el = self.JI_INFO.get(branch, {}).get('element')
            
            if stem_el: elements[stem_el] += 1
            if branch_el: elements[branch_el] += 1

        # Identiy Day Master (Day Stem)
        day_stem = day[0] # Day pillar stem
        day_master_info = self.GAN_INFO.get(day_stem, {})
        day_master_element = day_master_info.get('element')
        
        # Simple summary for LLM
        summary = f"""
        [오행 분포]
        목: {elements['Wood']}개
        화: {elements['Fire']}개
        토: {elements['Earth']}개
        금: {elements['Metal']}개
        수: {elements['Water']}개
        
        [일간(Day Master)]
        당신은 '{day_master_info.get('name')}({self.GAN_INFO.get(day_stem, {}).get('element_ko', day_master_info.get('element'))})' 일간입니다.
        """
        
        return {
            "elements": elements,
            "day_master": day_master_info,
            "summary_for_llm": summary
        }
