# Fortune Telling - 2026 운세 서비스

온라인 사주 분석 및 AI 기반 운세 해석 서비스

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Google Gemini API Key ([Get here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone & Setup**
```bash
git clone <repository-url>
cd Fortune_Telling
```

2. **Backend Setup**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Run Application**
```bash
# From project root
.\start.ps1  # Windows

# Or manually:
# Terminal 1 (Backend)
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

## 📁 Project Structure

```
Fortune_Telling/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Config & constants
│   │   ├── schemas/      # Pydantic models
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   └── requirements.txt
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── types/            # TypeScript types
│   └── package.json
└── guides/               # Documentation
```

## 🛠️ Tech Stack

**Backend:**
- FastAPI
- Google Gemini API
- Korean Lunar Calendar
- Ephem (Astronomical calculations)

**Frontend:**
- Next.js 16 (Turbopack)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- html-to-image

## 📝 Features

- ✅ 사주 계산 (년월일시주)
- ✅ 오행 분석
- ✅ AI 기반 2026년 운세 해석
- ✅ 결과 이미지 저장
- ✅ 공유 기능

## 📄 License

Private Project

## 👥 Contributors

Developed by Anti-Gravity Elite Dev Team
