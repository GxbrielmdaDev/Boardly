from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.list import List
from app.schemas.list import ListCreate, ListUpdate, ListResponse

router = APIRouter(prefix="/api", tags=["lists"])


@router.get("/boards/{board_id}/lists", response_model=list[ListResponse])
async def list_lists(
    board_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(List).where(List.board_id == board_id).order_by(List.position))
    return [ListResponse.model_validate(l) for l in result.scalars().all()]


@router.post("/boards/{board_id}/lists", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
async def create_list(
    board_id: int,
    data: ListCreate,
    db: AsyncSession = Depends(get_db),
):
    max_pos = await db.execute(select(func.max(List.position)).where(List.board_id == board_id))
    max_pos_value = max_pos.scalar() or 0

    lst = List(title=data.title, position=max_pos_value + 1.0, board_id=board_id)
    db.add(lst)
    await db.commit()
    await db.refresh(lst)
    return ListResponse.model_validate(lst)


@router.put("/lists/{list_id}", response_model=ListResponse)
async def update_list(
    list_id: int,
    data: ListUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(List).where(List.id == list_id))
    lst = result.scalar_one_or_none()
    if not lst:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="List not found")

    if data.title is not None:
        lst.title = data.title
    if data.position is not None:
        lst.position = data.position

    await db.commit()
    await db.refresh(lst)
    return ListResponse.model_validate(lst)


@router.delete("/lists/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_list(
    list_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(List).where(List.id == list_id))
    lst = result.scalar_one_or_none()
    if not lst:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="List not found")

    await db.delete(lst)
    await db.commit()


@router.patch("/lists/{list_id}/position", response_model=ListResponse)
async def reorder_list(
    list_id: int,
    data: ListUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(List).where(List.id == list_id))
    lst = result.scalar_one_or_none()
    if not lst:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="List not found")

    lst.position = data.position
    await db.commit()
    await db.refresh(lst)
    return ListResponse.model_validate(lst)
