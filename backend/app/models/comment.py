from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    content: Mapped[str] = mapped_column(Text)
    card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    card = relationship("Card", back_populates="comments")
    user = relationship("User", back_populates="comments")


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    action: Mapped[str] = mapped_column(String(200))
    card_id: Mapped[int] = mapped_column(Integer, ForeignKey("cards.id"))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    card = relationship("Card", back_populates="activities")
    user = relationship("User", back_populates="activities")
