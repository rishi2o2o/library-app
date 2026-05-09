from typing import List

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Book, Loan, User
from backend.schemas import CreateLoanRequest, LoanResponse

router = APIRouter(prefix="/loans", tags=["loans"])


def _require_user_id(x_user_id: int | None) -> int:
    if x_user_id is None:
        raise HTTPException(status_code=400, detail="X-User-Id header is required")
    return x_user_id


@router.post("", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
def create_loan(
    payload: CreateLoanRequest,
    x_user_id: int | None = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    user_id = _require_user_id(x_user_id)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    loan = None
    book = None
    try:
        active_loan = (
            db.query(Loan)
            .filter(Loan.user_id == user_id, Loan.status == "active")
            .with_for_update()
            .first()
        )
        if active_loan:
            raise HTTPException(status_code=409, detail="User already has an active loan")

        book = (
            db.query(Book)
            .filter(Book.id == payload.book_id)
            .with_for_update()
            .first()
        )
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        if not book.is_available:
            raise HTTPException(status_code=409, detail="Book is not available")

        loan = Loan(user_id=user_id, book_id=book.id, status="active")
        book.is_available = False
        db.add(loan)
        db.commit()
        db.refresh(loan)
        db.refresh(book)
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise

    return LoanResponse(
        id=loan.id,
        user_id=loan.user_id,
        book_id=loan.book_id,
        status=loan.status,
        borrowed_at=loan.borrowed_at,
        returned_at=loan.returned_at,
        is_active=loan.status == "active",
        book_title=book.title,
        book_isbn=book.isbn,
    )


@router.get("/me", response_model=List[LoanResponse])
def get_my_loans(
    x_user_id: int | None = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    user_id = _require_user_id(x_user_id)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    rows = (
        db.query(Loan, Book.title, Book.isbn)
        .join(Book, Book.id == Loan.book_id)
        .filter(Loan.user_id == user_id)
        .order_by(Loan.borrowed_at.desc())
        .all()
    )

    return [
        LoanResponse(
            id=loan.id,
            user_id=loan.user_id,
            book_id=loan.book_id,
            status=loan.status,
            borrowed_at=loan.borrowed_at,
            returned_at=loan.returned_at,
            is_active=loan.status == "active",
            book_title=title,
            book_isbn=isbn,
        )
        for loan, title, isbn in rows
    ]


@router.post("/{loan_id}/return", response_model=LoanResponse)
def return_loan(
    loan_id: int,
    x_user_id: int | None = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    user_id = _require_user_id(x_user_id)

    loan = (
        db.query(Loan)
        .filter(Loan.id == loan_id, Loan.user_id == user_id)
        .with_for_update()
        .first()
    )
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.status != "active":
        raise HTTPException(status_code=409, detail="Loan is already returned")

    book = db.query(Book).filter(Book.id == loan.book_id).with_for_update().first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    try:
        loan.status = "returned"
        loan.returned_at = func.current_timestamp()
        book.is_available = True
        db.commit()
        db.refresh(loan)
    except Exception:
        db.rollback()
        raise

    return LoanResponse(
        id=loan.id,
        user_id=loan.user_id,
        book_id=loan.book_id,
        status=loan.status,
        borrowed_at=loan.borrowed_at,
        returned_at=loan.returned_at,
        is_active=False,
        book_title=book.title,
        book_isbn=book.isbn,
    )

