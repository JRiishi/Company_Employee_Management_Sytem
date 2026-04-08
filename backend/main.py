import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.exceptions import RequestValidationError
import traceback
from dotenv import load_dotenv

load_dotenv("backend/.env")

from backend.routes import auth, admin, employee, manager, tasks, hr, user

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    status_code = getattr(exc, "status_code", 500)
    detail = getattr(exc, "detail", str(exc) if status_code < 500 else "Internal server error")
    
    if status_code == 500:
        print(f"Server Error on {request.url}: {exc}")
        
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "data": None, "message": detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    msg = ", ".join([f"{e['loc'][-1]}: {e['msg']}" for e in errors])
    return JSONResponse(
        status_code=422,
        content={"success": False, "data": None, "message": f"Validation Error: {msg}"}
    )

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(employee.router, prefix="/api/employee", tags=["employee"])
app.include_router(manager.router, prefix="/api/manager", tags=["manager"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(hr.router, prefix="/api/hr", tags=["hr"])
app.include_router(user.router, prefix="/api/user", tags=["user"])
