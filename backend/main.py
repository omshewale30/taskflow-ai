from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import API routers
from app.api.v1.endpoints.notes_router import router as notes_router
from app.api.v1.endpoints.tasks_router import router as tasks_router
from app.api.v1.endpoints.calendar_router import router as calendar_router

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting TaskFlow AI API...")
    yield
    # Shutdown logic
    print("Shutting down TaskFlow AI API...")

# Create FastAPI app
app = FastAPI(
    title="TaskFlow AI API",
    description="API for TaskFlow AI meeting notes processor",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(notes_router, prefix="/api/v1/notes", tags=["notes"])
app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(calendar_router, prefix="/api/v1", tags=["calendar"])

@app.get("/")
async def root():
    return {"message": "Welcome to TaskFlow AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)