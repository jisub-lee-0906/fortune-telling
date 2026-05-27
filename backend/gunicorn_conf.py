import multiprocessing
import os

# Gunicorn configuration file for production
# Allow runtime override from environment for flexible deployment targets (local, Coolify, etc.)
_host = os.getenv("HOST", "0.0.0.0")
_port = os.getenv("PORT", "8000")
bind = f"{_host}:{_port}"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 5

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
