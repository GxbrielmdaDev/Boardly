from datetime import datetime
from pydantic import BaseModel


class BoardCreate(BaseModel):
    title: str
    description: str | None = None
    background_color: str = "#0f172a"


class BoardUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    background_color: str | None = None


class BoardResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    background_color: str
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BoardMemberCreate(BaseModel):
    user_id: int
    role: str = "member"


class BoardMemberResponse(BaseModel):
    id: int
    board_id: int
    user_id: int
    role: str

    class Config:
        from_attributes = True
