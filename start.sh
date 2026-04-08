#!/bin/bash
# Startup script for backend hosted natively
cd backend
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
