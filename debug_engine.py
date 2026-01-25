from backend.engine.manse import Manse
from backend.engine.analyzer import Analyzer
import json

def test():
    m = Manse()
    # Test date: 1990-01-01 12:00
    saju = m.get_saju(1990, 1, 1, 12, 0)
    print("=== Manse Output ===")
    print(json.dumps(saju, ensure_ascii=False, indent=2))
    
    a = Analyzer()
    analysis = a.analyze(saju)
    print("\n=== Analyzer Output ===")
    print(json.dumps(analysis, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    test()
