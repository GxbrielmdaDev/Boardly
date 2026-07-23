from datetime import datetime
from pydantic import BaseModel


class CardCreate(BaseModel):
    title: str
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None
    label: str | None = None


class CardUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None
    label: str | None = None


class CardMove(BaseModel):
    list_id: int
    position: float


class CardResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    position: float
    list_id: int
    assignee_id: int | None = None
    due_date: datetime | None = None
    label: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
