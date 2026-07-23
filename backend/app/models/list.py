from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class List(Base):
    __tablename__ = "lists"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100))
    position: Mapped[float] = mapped_column(default=0.0)
    board_id: Mapped[int] = mapped_column(Integer, ForeignKey("boards.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    board = relationship("Board", back_populates="lists")
    cards = relationship("Card", back_populates="list", cascade="all, delete-orphan", order_by="Card.position")
