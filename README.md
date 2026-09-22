# Fortune Telling

Korean saju calculation and interpretation service. The repository contains a FastAPI backend and a Next.js frontend.

## Local development

Requirements: Python 3.11+ and Node.js 20+. The backend uses Pydantic 2 or newer because its request validation uses `model_validator`.

```powershell
# Backend
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend, in another terminal
cd frontend
npm ci
$env:NEXT_PUBLIC_API_URL = "http://127.0.0.1:8000"
npm run dev
```

Copy `.env.example` to `.env`. `/interpret` is fail-closed: enabling it requires `INTERPRET_ENABLED=true`, `GEMINI_API_KEY`, and the server-only `INTERPRET_SERVER_TOKEN`. The browser uses the same-origin Next.js `/api/interpret` route; configure `BACKEND_API_URL` and `INTERPRET_SERVER_TOKEN` for that server route, never as `NEXT_PUBLIC_*` secrets. The calculator endpoint does not require Gemini.

## Verification

```powershell
cd backend
python -m unittest discover -s tests -v

cd ..\frontend
npm ci --ignore-scripts
node .\node_modules\eslint\bin\eslint.js .
node .\node_modules\next\dist\bin\next build

# When the npm command wrapper works in the local shell, these are equivalent:
# npm run lint
# npm run build
```

The API validates calendar dates and time ranges before invoking the calculator, so malformed requests return a validation response instead of an internal server error.

## Verification and maturity

The listed checks validate source behavior and the frontend production build. They do not prove a deployed service: no paid Gemini request, production database, external proxy/HTTPS configuration, or end-to-end interpretation with a live model was executed in this readiness work. Source publication is not a service deployment.

## Automated verification (2026-09-23)

No GitHub Actions workflows or runs are configured/recorded. The local test/build records above are not a remote CI pass.
