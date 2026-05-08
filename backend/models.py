from sqlalchemy import Boolean, Column, Enum, ForeignKey, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func

from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    isbn = Column(String(13), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    genre = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    publication_year = Column(Integer, nullable=True)
    is_available = Column(Boolean, nullable=False, default=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False, index=True)
    borrowed_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    status = Column(Enum("active", "returned", name="loan_status"), default="active")
    returned_at = Column(TIMESTAMP, nullable=True)

