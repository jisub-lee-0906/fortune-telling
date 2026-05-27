from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

import os

# Middleware
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins = [
    frontend_url,
    *getattr(settings, "FRONTEND_ORIGINS", ["http://localhost:3000"]),
    "http://127.0.0.1:3000",
    "http://localhost:3000"
]
ALLOWED_ORIGINS = list(dict.fromkeys([origin for origin in origins if origin]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
