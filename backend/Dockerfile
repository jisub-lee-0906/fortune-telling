FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY gunicorn_conf.py .

EXPOSE 8000

CMD ["sh", "-c", "gunicorn -c gunicorn_conf.py app.main:app --bind ${HOST:-0.0.0.0}:${PORT:-8000}"]
