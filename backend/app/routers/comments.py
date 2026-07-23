from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentResponse
from app.auth.jwt import get_default_user

router = APIRouter(prefix="/api", tags=["comments"])


@router.get("/cards/{card_id}/comments", response_model=list[CommentResponse])
async def list_comments(
    card_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Comment).where(Comment.card_id == card_id).order_by(Comment.created_at))
    return [CommentResponse.model_validate(c) for c in result.scalars().all()]


@router.post("/cards/{card_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    card_id: int,
    data: CommentCreate,
    db: AsyncSession = Depends(get_db),
):
    user = await get_default_user(db)
    comment = Comment(content=data.content, card_id=card_id, user_id=user.id)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return CommentResponse.model_validate(comment)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Comment).where(Comment.id == comment_id))
    comment = result.scalar_one_or_none()
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

    await db.delete(comment)
    await db.commit()
