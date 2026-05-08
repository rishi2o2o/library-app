from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Book
from backend.schemas import BookResponse

router = APIRouter(prefix="/books", tags=["books"])


@router.get("", response_model=List[BookResponse])
def list_books(
    available: bool = Query(default=True),
    db: Session = Depends(get_db),
):
    query = db.query(Book)
    if available:
        query = query.filter(Book.is_available.is_(True))
    return query.order_by(Book.title.asc()).all()


