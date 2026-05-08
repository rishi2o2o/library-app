from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_me(
    x_user_id: int | None = Header(default=None, alias="X-User-Id"),
    db: Session = Depends(get_db),
):
    if x_user_id is None:
        raise HTTPException(status_code=400, detail="X-User-Id header is required")

    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"id": user.id, "email": user.email, "name": user.name}


