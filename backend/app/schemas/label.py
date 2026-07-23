from datetime import datetime
from pydantic import BaseModel


class LabelCreate(BaseModel):
    name: str
    color: str


class LabelUpdate(BaseModel):
    name: str | None = None
    color: str | None = None


class LabelResponse(BaseModel):
    id: int
    name: str
    color: str
    board_id: int
    created_at: datetime

    class Config:
        from_attributes = True
