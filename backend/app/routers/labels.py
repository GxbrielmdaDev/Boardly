from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.board import Board
from app.models.label import Label
from app.schemas.label import LabelCreate, LabelUpdate, LabelResponse

router = APIRouter(tags=["labels"])


@router.get("/api/boards/{board_id}/labels", response_model=list[LabelResponse])
async def list_labels(
    board_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Label).where(Label.board_id == board_id).order_by(Label.created_at))
    return [LabelResponse.model_validate(l) for l in result.scalars().all()]


@router.post("/api/boards/{board_id}/labels", response_model=LabelResponse, status_code=status.HTTP_201_CREATED)
async def create_label(
    board_id: int,
    data: LabelCreate,
    db: AsyncSession = Depends(get_db),
):
    board = await db.get(Board, board_id)
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    label = Label(name=data.name, color=data.color, board_id=board_id)
    db.add(label)
    await db.commit()
    await db.refresh(label)
    return LabelResponse.model_validate(label)


@router.put("/api/labels/{label_id}", response_model=LabelResponse)
async def update_label(
    label_id: int,
    data: LabelUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Label).where(Label.id == label_id))
    label = result.scalar_one_or_none()
    if not label:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")

    if data.name is not None:
        label.name = data.name
    if data.color is not None:
        label.color = data.color

    await db.commit()
    await db.refresh(label)
    return LabelResponse.model_validate(label)


@router.delete("/api/labels/{label_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_label(
    label_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Label).where(Label.id == label_id))
    label = result.scalar_one_or_none()
    if not label:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Label not found")

    await db.delete(label)
    await db.commit()
