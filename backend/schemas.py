from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BookResponse(BaseModel):
    id: int
    isbn: str
    title: str
    author: str
    genre: Optional[str] = None
    description: Optional[str] = None
    publication_year: Optional[int] = None
    is_available: bool

    class Config:
        from_attributes = True


class CreateLoanRequest(BaseModel):
    book_id: int


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int


class LoanResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    status: str
    borrowed_at: datetime
    returned_at: Optional[datetime] = None
    is_active: bool
    book_title: Optional[str] = None
    book_isbn: Optional[str] = None

    class Config:
        from_attributes = True
