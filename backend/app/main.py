from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import itinerary, budget, group

app = FastAPI(
    title="VoyaAI API",
    description="Personality-based local discovery, budget optimization, and group trip consensus.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(itinerary.router)
app.include_router(budget.router)
app.include_router(group.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "VoyaAI API"}
