import os
from typing import List


def _parse_csv(value: str) -> List[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    PROJECT_NAME: str = "Fortune Telling API"
    VERSION: str = "1.0.0"

    # CORS
    FRONTEND_URLS: str = os.getenv(
        "FRONTEND_URLS", "http://localhost:3000,https://localhost:3000"
    )
    FRONTEND_ORIGINS: List[str] = _parse_csv(FRONTEND_URLS)

    # Runtime
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))


settings = Settings()
