from datetime import datetime, timedelta
import ephem
from korean_lunar_calendar import KoreanLunarCalendar
from app.core.constants import GAN_HANJA, JI_HANJA, HANJA_TO_HANGUL, HANGUL_TO_HANJA

class CalculatorService:
    def __init__(self):
        pass

    def get_solar_longitude(self, year, month, day, hour, minute):
        observer = ephem.Observer()
        observer.date = datetime(year, month, day, hour, minute) - timedelta(hours=9) # KST to UTC
        sun = ephem.Sun(observer)
        ecl = ephem.Ecliptic(sun)
        return  float(ecl.lon) * 180.0 / ephem.pi # Convert to degrees

    def get_saju(self, year, month, day, hour, minute):
        # 1. Day Pillar (Base Reference)
        cal = KoreanLunarCalendar()
        cal.setSolarDate(year, month, day)
        # Returns like "계묘년 을축월 기해일"
        gapja = cal.getGapJaString().split()
        
        # Parse output e.g. "기해일" -> "기해"
        day_str = gapja[2].replace('일', '')
        day_stem_kr = day_str[0]
        day_branch_kr = day_str[1]
        
        # Convert to Hanja for internal calculation
        day_stem_hanja = HANGUL_TO_HANJA.get(day_stem_kr)
        day_branch_hanja = HANGUL_TO_HANJA.get(day_branch_kr)
        day_pillar_hanja = day_stem_hanja + day_branch_hanja
        
        # 2. Year & Month Pillar Correction (Solar Term Logic)
        lon = self.get_solar_longitude(year, month, day, hour, minute)
        
        # Year Logic (Ipchun = 315 deg)
        saju_year = year
        # Basic check: if Month is 1 or 2, checking if before Ipchun
        if month <= 2:
            # If Before Ipchun (Long < 315) AND after Winter Solstice (Lon >= 270)
            # Effectively Jan 1 ~ Feb 4
            if 270 <= lon < 315:
                saju_year = year - 1
        
        # Month Logic (Based on 24 Terms)
        # Normalize: Ipchun(315) -> 0
        normalized_lon = (lon - 315) % 360
        # Each month is 30 degrees (approx, actually 2 terms per month)
        month_idx_exact = int(normalized_lon // 30) 
        # 0=In(Tiger), 1=Myo(Rabbit)...
        
        month_branch_idx = (month_idx_exact + 2) % 12 # 0->2(In), 1->3(Myo)
        month_branch = JI_HANJA[month_branch_idx]
        
        # Year Stem
        year_gan_idx = (saju_year - 4) % 10 
        year_gan = GAN_HANJA[year_gan_idx]
        
        # Year Branch
        year_branch_idx = (saju_year - 4) % 12
        year_branch = JI_HANJA[year_branch_idx]
        year_pillar_hanja = year_gan + year_branch
        
        # Month Stem (Nyeon-Du-Beop)
        month_stem = self._get_month_stem(year_gan, month_branch)
        month_pillar_hanja = month_stem + month_branch
        
        # 4. Hour Pillar
        hour_branch = self._get_hour_branch(hour, minute)
        hour_stem = self._get_hour_stem(day_stem_hanja, hour_branch)
        hour_pillar_hanja = hour_stem + hour_branch
        
        return {
            "year": self._h(year_pillar_hanja),
            "month": self._h(month_pillar_hanja),
            "day": self._h(day_pillar_hanja),
            "hour": self._h(hour_pillar_hanja),
            "hour_hanja": hour_pillar_hanja,
            "text": f"{self._h(year_pillar_hanja)}년 {self._h(month_pillar_hanja)}월 {self._h(day_pillar_hanja)}일 {self._h(hour_pillar_hanja)}시"
        }


    def _h(self, hanja):
        """Helper to convert 2-char Hanja string to Hangul"""
        return HANJA_TO_HANGUL[hanja[0]] + HANJA_TO_HANGUL[hanja[1]]

    def _get_month_stem(self, year_stem, month_branch):
        # Nyeon-Du-Beop
        start_map = {"甲": 2, "己": 2, "乙": 4, "庚": 4, "丙": 6, "辛": 6, "丁": 8, "壬": 8, "戊": 0, "癸": 0}
        
        target_branch_idx = JI_HANJA.index(month_branch)
        offset = (target_branch_idx - 2) % 12
        
        start_stem_idx = start_map[year_stem]
        final_stem_idx = (start_stem_idx + offset) % 10
        return GAN_HANJA[final_stem_idx]

    def _get_hour_branch(self, hour, minute):
        total_mins = hour * 60 + minute
        if total_mins >= 23*60 + 30 or total_mins < 1*60 + 30: return "子"
        elif total_mins < 3*60 + 30: return "丑"
        elif total_mins < 5*60 + 30: return "寅"
        elif total_mins < 7*60 + 30: return "卯"
        elif total_mins < 9*60 + 30: return "辰"
        elif total_mins < 11*60 + 30: return "巳"
        elif total_mins < 13*60 + 30: return "午"
        elif total_mins < 15*60 + 30: return "未"
        elif total_mins < 17*60 + 30: return "申"
        elif total_mins < 19*60 + 30: return "酉"
        elif total_mins < 21*60 + 30: return "戌"
        else: return "亥"

    def _get_hour_stem(self, day_stem, hour_branch):
        start_stem_map = {
            "甲": 0, "己": 0, "乙": 2, "庚": 2, "丙": 4, "辛": 4,
            "丁": 6, "壬": 6, "戊": 8, "癸": 8
        }
        start_idx = start_stem_map.get(day_stem, 0)
        try: branch_idx = JI_HANJA.index(hour_branch)
        except: return "?"
        return GAN_HANJA[(start_idx + branch_idx) % 10]
