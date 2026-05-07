# Coolify + docker-compose 배포 가이드 (현재 레포 기준)

이 레포는 `backend`(FastAPI) + `frontend`(Next.js) 모노레포입니다.
`docker-compose.yml` 하나로 두 컨테이너를 한 번에 배포할 수 있습니다.

## 1) 무엇이 추가되었나
- 루트 `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `.env.example`

## 2) Coolify 설정
- New Project/Service 생성
- Deploy Method: `Docker Compose`
- Compose 파일: 루트의 `docker-compose.yml` 사용

## 3) 환경 변수(중요)
루트 `.env` 또는 Coolify 환경변수에 아래 항목을 넣으세요.

- 공통
  - `GEMINI_API_KEY` (필수)
  - `FRONTEND_URLS` (필수)
    - 예: `https://your-frontend-domain.example.com`

- backend 컨테이너
  - `HOST=0.0.0.0`
  - `PORT=8000`
  - `expose: 8000` (호스트 포트 바인딩은 현재 미사용)

- frontend 컨테이너
  - `PORT=3000`
  - `NEXT_PUBLIC_API_URL`
    - 예: `https://your-backend-domain.example.com`
    - 기본값은 현재 compose에서 `http://backend:8000`이지만, 실제 서비스 도메인 사용 권장
  - `FRONTEND_HOST_PORT` (클릭 충돌 방지, 예: `3001`)

## 4) 동작 확인
- 백엔드: `GET /` 응답 정상
- 프론트: `NEXT_PUBLIC_API_URL`이 실제 백엔드 주소인지 확인
- 백엔드 CORS: `FRONTEND_URLS`에 프론트 주소 포함
- `FRONTEND_HOST_PORT` 값이 다른 서비스와 충돌 안 하는지 확인

## 5) 배포 실패가 자주 나는 포인트
- `BACKEND`와 `FRONTEND`의 포트를 서로 맞추지 않은 경우
- 프론트 env가 `http://127.0.0.1:8000`으로 fallback되는 경우
- `GEMINI_API_KEY` 미설정 (API 처리 실패)
