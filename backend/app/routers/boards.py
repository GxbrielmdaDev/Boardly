from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.board import Board, BoardMember
from app.schemas.board import BoardCreate, BoardUpdate, BoardResponse, BoardMemberCreate, BoardMemberResponse
from app.auth.jwt import get_default_user

router = APIRouter(prefix="/api/boards", tags=["boards"])


@router.get("/", response_model=list[BoardResponse])
async def list_boards(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Board).order_by(Board.created_at))
    return [BoardResponse.model_validate(b) for b in result.scalars().all()]


@router.post("/", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
async def create_board(
    data: BoardCreate,
    db: AsyncSession = Depends(get_db),
):
    user = await get_default_user(db)
    board = Board(title=data.title, description=data.description, background_color=data.background_color, owner_id=user.id)
    db.add(board)
    await db.commit()
    await db.refresh(board)

    db.add(BoardMember(board_id=board.id, user_id=user.id, role="owner"))
    await db.commit()

    return BoardResponse.model_validate(board)


@router.get("/{board_id}", response_model=BoardResponse)
async def get_board(
    board_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Board).where(Board.id == board_id))
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    return BoardResponse.model_validate(board)


@router.put("/{board_id}", response_model=BoardResponse)
async def update_board(
    board_id: int,
    data: BoardUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Board).where(Board.id == board_id))
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    if data.title is not None:
        board.title = data.title
    if data.description is not None:
        board.description = data.description
    if data.background_color is not None:
        board.background_color = data.background_color

    await db.commit()
    await db.refresh(board)
    return BoardResponse.model_validate(board)


@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_board(
    board_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Board).where(Board.id == board_id))
    board = result.scalar_one_or_none()
    if not board:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    await db.delete(board)
    await db.commit()


@router.get("/{board_id}/members", response_model=list[BoardMemberResponse])
async def list_members(
    board_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(BoardMember).where(BoardMember.board_id == board_id))
    return [BoardMemberResponse.model_validate(m) for m in result.scalars().all()]


@router.post("/{board_id}/members", response_model=BoardMemberResponse, status_code=status.HTTP_201_CREATED)
async def add_member(
    board_id: int,
    data: BoardMemberCreate,
    db: AsyncSession = Depends(get_db),
):
    member = BoardMember(board_id=board_id, user_id=data.user_id, role=data.role)
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return BoardMemberResponse.model_validate(member)
