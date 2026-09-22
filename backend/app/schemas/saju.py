from datetime import date
from typing import Any, Dict

from pydantic import BaseModel, Field, model_validator


# --- Request Models ---
class SajuRequest(BaseModel):
    year: int = Field(ge=1, le=9999)
    month: int = Field(ge=1, le=12)
    day: int = Field(ge=1, le=31)
    hour: int = Field(ge=0, le=23)
    minute: int = Field(default=0, ge=0, le=59)
    gender: str = "male"

    @model_validator(mode="after")
    def has_valid_calendar_date(self) -> "SajuRequest":
        # Reject invalid calendar dates at the API boundary instead of letting the
        # calculator fail later and turn a client error into a 500 response.
        date(self.year, self.month, self.day)
        return self

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
