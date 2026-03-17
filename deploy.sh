#!/bin/bash

echo "Starting Production Build..."

# 1. Backend setup
echo "Setting up Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn uvicorn
cd ..

# 2. Frontend setup
echo "Setting up Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build Complete. Run the servers using PM2 or background processes."
