import asyncio
import hmac
import time
from collections import deque
from contextlib import asynccontextmanager

from fastapi import HTTPException, status


class InterpretGuard:
    def __init__(self, enabled: bool, token: str, requests_per_minute: int, max_concurrency: int):
        self.enabled = enabled
        self.token = token
        self.requests_per_minute = max(1, requests_per_minute)
        self.max_concurrency = max(1, max_concurrency)
        self._starts = deque()
        self._active = 0
        self._lock = asyncio.Lock()

    @asynccontextmanager
    async def admit(self, supplied_token: str | None):
        if not self.enabled:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Paid interpretation is disabled")
        try:
            token_valid = bool(self.token and supplied_token) and hmac.compare_digest(
                self.token.encode("utf-8"), supplied_token.encode("utf-8")
            )
        except (AttributeError, UnicodeError, TypeError):
            token_valid = False
        if not token_valid:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

        now = time.monotonic()
        async with self._lock:
            while self._starts and self._starts[0] <= now - 60:
                self._starts.popleft()
            if len(self._starts) >= self.requests_per_minute:
                raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Interpretation rate limit exceeded")
            if self._active >= self.max_concurrency:
                raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Interpretation concurrency limit exceeded")
            self._starts.append(now)
            self._active += 1
        try:
            yield
        finally:
            async with self._lock:
                self._active -= 1
