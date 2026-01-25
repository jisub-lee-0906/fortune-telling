# Celestial Stems (Cheongan) - 天干
GAN_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
GAN_HANGUL = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"]

# Earthly Branches (Jiji) - 地支
JI_HANJA = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
JI_HANGUL = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"]

# Mappings
HANJA_TO_HANGUL = dict(zip(GAN_HANJA + JI_HANJA, GAN_HANGUL + JI_HANGUL))
HANGUL_TO_HANJA = dict(zip(GAN_HANGUL + JI_HANGUL, GAN_HANJA + JI_HANJA))

# Detailed Properties for Analysis
GAN_PROPERTIES = {
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

JI_PROPERTIES = {
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
