from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Text, ForeignKey, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Card(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    position: Mapped[float] = mapped_column(default=0.0)
    list_id: Mapped[int] = mapped_column(Integer, ForeignKey("lists.id"))
    assignee_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    label: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    list = relationship("List", back_populates="cards")
    assignee = relationship("User")
    comments = relationship("Comment", back_populates="card", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="card", cascade="all, delete-orphan")
