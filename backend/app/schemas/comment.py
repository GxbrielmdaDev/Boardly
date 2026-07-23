from datetime import datetime
from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: int
    content: str
    card_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
