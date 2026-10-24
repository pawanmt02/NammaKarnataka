"""
Namma Kannada Backend - Main FastAPI Application
Entry point with CORS, rate limiting, and all router registrations.
"""

import warnings
warnings.filterwarnings("ignore")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    has_slowapi = True
except ImportError:
    has_slowapi = False
    Limiter = None
    _rate_limit_exceeded_handler = None
    RateLimitExceeded = None
    get_remote_address = None

from app.core.config import settings
from app.api.phrases import router as phrases_router
from app.api.translate import router as translate_router
from app.api.quiz import router as quiz_router
from app.api.etymology import router as etymology_router
from app.api.geo import router as geo_router
from app.api.auth import router as auth_router
from app.api.developer import router as developer_router

# ─── Rate Limiter ────────────────────────────────────────────────────────────

if has_slowapi:
    limiter = Limiter(key_func=get_remote_address)
else:
    limiter = None

# ─── App Initialization ─────────────────────────────────────────────────────

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "REST API for the Namma Kannada Regional Language Explorer. "
        "Provides endpoints for dialect phrases, Gemini-powered translation, "
        "gamified quizzes, etymology graphs, crowdsourced contributions, "
        "and geo-fenced cultural notifications."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── Middleware ───────────────────────────────────────────────────────────────

if has_slowapi and limiter:
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Router Registration ────────────────────────────────────────────────────

app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(phrases_router, prefix=settings.API_V1_PREFIX)
app.include_router(translate_router, prefix=settings.API_V1_PREFIX)
app.include_router(quiz_router, prefix=settings.API_V1_PREFIX)
app.include_router(etymology_router, prefix=settings.API_V1_PREFIX)
app.include_router(geo_router, prefix=settings.API_V1_PREFIX)
app.include_router(developer_router, prefix=settings.API_V1_PREFIX)

# ─── Root & Health Endpoints ─────────────────────────────────────────────────


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint — API info."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
        "description": "Namma Kannada - Regional Language Explorer API",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "version": settings.VERSION}


# ─── Global Exception Handler ───────────────────────────────────────────────


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler."""
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred",
        },
    )
