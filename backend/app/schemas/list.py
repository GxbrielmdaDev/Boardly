from datetime import datetime
from pydantic import BaseModel


class ListCreate(BaseModel):
    title: str


class ListUpdate(BaseModel):
    title: str | None = None
    position: float | None = None


class ListResponse(BaseModel):
    id: int
    title: str
    position: float
    board_id: int
    created_at: datetime

    class Config:
        from_attributes = True
