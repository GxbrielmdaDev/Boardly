from datetime import datetime
from pydantic import BaseModel

from app.schemas.label import LabelResponse


class CardCreate(BaseModel):
    title: str
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None
    label_ids: list[int] = []


class CardUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    assignee_id: int | None = None
    due_date: datetime | None = None
    label_ids: list[int] | None = None


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
    labels: list[LabelResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
