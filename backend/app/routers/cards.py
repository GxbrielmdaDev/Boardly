from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.card import Card
from app.schemas.card import CardCreate, CardUpdate, CardMove, CardResponse
from app.auth.jwt import get_default_user

router = APIRouter(prefix="/api", tags=["cards"])


@router.get("/lists/{list_id}/cards", response_model=list[CardResponse])
async def list_cards(
    list_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Card).where(Card.list_id == list_id).order_by(Card.position))
    return [CardResponse.model_validate(c) for c in result.scalars().all()]


@router.post("/lists/{list_id}/cards", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
async def create_card(
    list_id: int,
    data: CardCreate,
    db: AsyncSession = Depends(get_db),
):
    max_pos = await db.execute(select(func.max(Card.position)).where(Card.list_id == list_id))
    max_pos_value = max_pos.scalar() or 0

    card = Card(
        title=data.title,
        description=data.description,
        position=max_pos_value + 1.0,
        list_id=list_id,
        assignee_id=data.assignee_id,
        due_date=data.due_date,
        label=data.label,
    )
    db.add(card)
    await db.commit()
    await db.refresh(card)
    return CardResponse.model_validate(card)


@router.get("/cards/{card_id}", response_model=CardResponse)
async def get_card(
    card_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Card).where(Card.id == card_id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return CardResponse.model_validate(card)


@router.put("/cards/{card_id}", response_model=CardResponse)
async def update_card(
    card_id: int,
    data: CardUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Card).where(Card.id == card_id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    if data.title is not None:
        card.title = data.title
    if data.description is not None:
        card.description = data.description
    if data.assignee_id is not None:
        card.assignee_id = data.assignee_id
    if data.due_date is not None:
        card.due_date = data.due_date
    if data.label is not None:
        card.label = data.label

    await db.commit()
    await db.refresh(card)
    return CardResponse.model_validate(card)


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(
    card_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Card).where(Card.id == card_id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    await db.delete(card)
    await db.commit()


@router.patch("/cards/{card_id}/move", response_model=CardResponse)
async def move_card(
    card_id: int,
    data: CardMove,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Card).where(Card.id == card_id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")

    card.list_id = data.list_id
    card.position = data.position
    await db.commit()
    await db.refresh(card)
    return CardResponse.model_validate(card)
