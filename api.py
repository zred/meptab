from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from database import create_db_and_tables
from routes import router
from contextlib import asynccontextmanager
from cache import init_redis
from logging_config import log_to_endpoint, log_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    await init_redis()
    await log_manager.initialize()
    await log_to_endpoint("INFO", "Application started")
    yield
    await log_to_endpoint("INFO", "Application shutting down")

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static files directory
app.mount("/scripts", StaticFiles(directory="scripts"), name="scripts")
app.mount("/data", StaticFiles(directory="data"), name="data")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize Jinja2Templates
templates = Jinja2Templates(directory="templates")

# Include the router
app.include_router(router)

# Add templates to app state
app.state.templates = templates

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
