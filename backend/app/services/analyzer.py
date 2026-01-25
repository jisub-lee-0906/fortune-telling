class AnalysisService:
    def __init__(self):
        # 10 Stems (Cheongan) Properties - HANGUL KEYS
        self.GAN_INFO = {
            "갑": {"element": "Wood", "element_ko": "목", "polarity": "+", "name": "갑"},
            "을": {"element": "Wood", "element_ko": "목", "polarity": "-", "name": "을"},
            "병": {"element": "Fire", "element_ko": "화", "polarity": "+", "name": "병"},
            "정": {"element": "Fire", "element_ko": "화", "polarity": "-", "name": "정"},
            "무": {"element": "Earth", "element_ko": "토", "polarity": "+", "name": "무"},
            "기": {"element": "Earth", "element_ko": "토", "polarity": "-", "name": "기"},
            "경": {"element": "Metal", "element_ko": "금", "polarity": "+", "name": "경"},
            "신": {"element": "Metal", "element_ko": "금", "polarity": "-", "name": "신"},
            "임": {"element": "Water", "element_ko": "수", "polarity": "+", "name": "임"},
            "계": {"element": "Water", "element_ko": "수", "polarity": "-", "name": "계"},
        }

        # 12 Branches (Jiji) Properties - HANGUL KEYS
        self.JI_INFO = {
            "자": {"element": "Water", "polarity": "+", "name": "Ja", "animal": "Rat"},
            "축": {"element": "Earth", "polarity": "-", "name": "Chuk", "animal": "Ox"},
            "인": {"element": "Wood", "polarity": "+", "name": "In", "animal": "Tiger"},
            "묘": {"element": "Wood", "polarity": "-", "name": "Myo", "animal": "Rabbit"},
            "진": {"element": "Earth", "polarity": "+", "name": "Jin", "animal": "Dragon"},
            "사": {"element": "Fire", "polarity": "-", "name": "Sa", "animal": "Snake"},
            "오": {"element": "Fire", "polarity": "+", "name": "O", "animal": "Horse"},
            "미": {"element": "Earth", "polarity": "-", "name": "Mi", "animal": "Sheep"},
            "신": {"element": "Metal", "polarity": "+", "name": "Sin", "animal": "Monkey"},
            "유": {"element": "Metal", "polarity": "-", "name": "Yu", "animal": "Rooster"},
            "술": {"element": "Earth", "polarity": "+", "name": "Sul", "animal": "Dog"},
            "해": {"element": "Water", "polarity": "-", "name": "Hae", "animal": "Pig"},
        }

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
