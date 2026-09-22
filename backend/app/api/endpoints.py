from fastapi import APIRouter, Depends, Header, HTTPException
from app.schemas.saju import SajuRequest
from app.services.calculator import CalculatorService
from app.services.analyzer import AnalysisService
from app.services.llm import LLMService
from app.api import deps
from app.core.config import settings
from app.core.security import InterpretGuard

router = APIRouter()
interpret_guard = InterpretGuard(
    settings.INTERPRET_ENABLED,
    settings.INTERPRET_SERVER_TOKEN,
    settings.INTERPRET_REQUESTS_PER_MINUTE,
    settings.INTERPRET_MAX_CONCURRENCY,
)


@router.get("/")
def read_root():
    return {"status": "System Operational", "layer": "Clean Architecture"}


@router.post("/calculate")
def calculate_saju(
    req: SajuRequest,
    calculator: CalculatorService = Depends(deps.get_calculator),
    analyzer: AnalysisService = Depends(deps.get_analyzer),
):
    try:
        result = calculator.get_saju(req.year, req.month, req.day, req.hour, req.minute)
        analysis = analyzer.analyze(result)
        return {"status": "success", "data": {**result, "analysis": analysis}}
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to calculate fortune data")


@router.post("/interpret")
async def interpret_saju(
    req: SajuRequest,
    x_interpret_token: str | None = Header(default=None),
    calculator: CalculatorService = Depends(deps.get_calculator),
    analyzer: AnalysisService = Depends(deps.get_analyzer),
    llm: LLMService = Depends(deps.get_llm),
):
    async with interpret_guard.admit(x_interpret_token):
        try:
            saju_result = calculator.get_saju(req.year, req.month, req.day, req.hour, req.minute)
            analysis_data = analyzer.analyze(saju_result)
            interpretation = await llm.interpret(saju_result, analysis_data)
            return {
                "status": "success",
                "data": {
                    "saju": saju_result,
                    "analysis": analysis_data,
                    "interpretation": interpretation,
                },
            }
        except Exception:
            raise HTTPException(status_code=500, detail="Unable to interpret fortune data")
