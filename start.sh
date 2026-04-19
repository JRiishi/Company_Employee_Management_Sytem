#!/bin/bash
# Startup script for backend and frontend

# Start backend in the background
echo "Starting backend server..."
cd backend
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} &
cd ..

# Start frontend
echo "Starting frontend development server..."
cd frontend
npm install
npm run dev

