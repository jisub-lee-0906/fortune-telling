import os
from typing import List


def _parse_csv(value: str) -> List[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _env_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


class Settings:
    PROJECT_NAME: str = "Fortune Telling API"
    VERSION: str = "1.0.0"

    FRONTEND_URLS: str = os.getenv(
        "FRONTEND_URLS", "http://localhost:3000,https://localhost:3000"
    )
    FRONTEND_ORIGINS: List[str] = _parse_csv(FRONTEND_URLS)

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    INTERPRET_ENABLED: bool = _env_bool("INTERPRET_ENABLED")
    INTERPRET_SERVER_TOKEN: str = os.getenv("INTERPRET_SERVER_TOKEN", "")
    INTERPRET_REQUESTS_PER_MINUTE: int = int(os.getenv("INTERPRET_REQUESTS_PER_MINUTE", "10"))
    INTERPRET_MAX_CONCURRENCY: int = int(os.getenv("INTERPRET_MAX_CONCURRENCY", "2"))


settings = Settings()
