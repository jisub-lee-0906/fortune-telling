import os

class Settings:
    PROJECT_NAME: str = "Anti-Gravity Fortune Telling API"
    VERSION: str = "1.0.0"
    
    # LLM Settings
    OLLAMA_MODEL: str = "exaone3.5:7.8b" 
    OLLAMA_TIMEOUT: int = 60

settings = Settings()
