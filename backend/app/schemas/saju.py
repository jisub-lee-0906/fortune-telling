from pydantic import BaseModel
from typing import Dict, Any, Optional

# --- Request Models ---
class SajuRequest(BaseModel):
    year: int
    month: int
    day: int
    hour: int
    minute: int = 0
    gender: str = "male"

# --- Response Models ---
class SajuResponse(BaseModel):
    year: str
    month: str
    day: str
    hour: str
    hour_hanja: str
    text: str

class AnalysisResponse(BaseModel):
    elements: Dict[str, int]
    day_master: Dict[str, Any]
    summary_for_llm: str

class InterpretResponse(BaseModel):
    saju: SajuResponse
    analysis: AnalysisResponse
    interpretation: str
