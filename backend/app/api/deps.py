from app.services.calculator import CalculatorService
from app.services.analyzer import AnalysisService
from app.services.llm import LLMService

# Singleton instances (or per-request if stateful, but these are stateless)
_calculator = CalculatorService()
_analyzer = AnalysisService()
_llm = LLMService()

def get_calculator():
    return _calculator

def get_analyzer():
    return _analyzer

def get_llm():
    return _llm
