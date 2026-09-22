import asyncio
import unittest

from fastapi import HTTPException

from app.core.security import InterpretGuard


class InterpretGuardTest(unittest.IsolatedAsyncioTestCase):
    async def test_disabled_by_default(self):
        guard = InterpretGuard(False, "server-token", 10, 2)
        with self.assertRaises(HTTPException) as raised:
            async with guard.admit("server-token"):
                pass
        self.assertEqual(raised.exception.status_code, 503)

    async def test_rejects_missing_or_wrong_token(self):
        guard = InterpretGuard(True, "server-token", 10, 2)
        for token in (None, "wrong", "비ASCII-토큰"):
            with self.subTest(token=token), self.assertRaises(HTTPException) as raised:
                async with guard.admit(token):
                    pass
            self.assertEqual(raised.exception.status_code, 401)

    async def test_enforces_rate_limit(self):
        guard = InterpretGuard(True, "server-token", 1, 2)
        async with guard.admit("server-token"):
            pass
        with self.assertRaises(HTTPException) as raised:
            async with guard.admit("server-token"):
                pass
        self.assertEqual(raised.exception.status_code, 429)

    async def test_enforces_concurrency_limit(self):
        guard = InterpretGuard(True, "server-token", 10, 1)
        entered = asyncio.Event()
        release = asyncio.Event()

        async def occupy():
            async with guard.admit("server-token"):
                entered.set()
                await release.wait()

        task = asyncio.create_task(occupy())
        await entered.wait()
        try:
            with self.assertRaises(HTTPException) as raised:
                async with guard.admit("server-token"):
                    pass
            self.assertEqual(raised.exception.status_code, 429)
        finally:
            release.set()
            await task


if __name__ == "__main__":
    unittest.main()

