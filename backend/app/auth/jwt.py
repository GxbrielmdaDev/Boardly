from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User


async def get_default_user(db: AsyncSession):
    result = await db.execute(select(User).where(User.id == 1))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(
            username="default",
            email="default@boardly.com",
            password_hash="default",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user
