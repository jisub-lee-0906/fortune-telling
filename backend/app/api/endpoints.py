from fastapi import APIRouter, Depends, HTTPException
from app.schemas.saju import SajuRequest, InterpretResponse
from app.services.calculator import CalculatorService
from app.services.analyzer import AnalysisService
from app.services.llm import LLMService
from app.api import deps

router = APIRouter()

@router.get("/")
def read_root():
    return {"status": "System Operational", "layer": "Clean Architecture"}

@router.post("/calculate")
def calculate_saju(
    req: SajuRequest,
    calculator: CalculatorService = Depends(deps.get_calculator),
    analyzer: AnalysisService = Depends(deps.get_analyzer)
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
    calculator: CalculatorService = Depends(deps.get_calculator),
    analyzer: AnalysisService = Depends(deps.get_analyzer),
    llm: LLMService = Depends(deps.get_llm)
):
    try:
        # 1. Calculate
        saju_result = calculator.get_saju(req.year, req.month, req.day, req.hour, req.minute)
        
        # 2. Analyze
        analysis_data = analyzer.analyze(saju_result)
        
        # 3. Interpret
        interpretation = await llm.interpret(saju_result, analysis_data)
        
        return {
            "status": "success", 
            "data": {
                "saju": saju_result, 
                "analysis": analysis_data, 
                "interpretation": interpretation
            }
        }
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to interpret fortune data")
