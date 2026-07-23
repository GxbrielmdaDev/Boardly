from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_tables
from app.routers.auth import router as auth_router
from app.routers.boards import router as boards_router
from app.routers.lists import router as lists_router
from app.routers.cards import router as cards_router
from app.routers.comments import router as comments_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(title="Boardly API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(boards_router)
app.include_router(lists_router)
app.include_router(cards_router)
app.include_router(comments_router)
