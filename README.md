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

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable `/interpret`. The calculator endpoint does not require that key.

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
