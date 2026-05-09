import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def _get_jwt_settings() -> tuple[str, str, int]:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY is not set")

    algorithm = os.getenv("JWT_ALGORITHM")
    expire_minutes_raw = os.getenv("JWT_EXPIRE_MINUTES")
    try:
        expire_minutes = int(expire_minutes_raw)
    except ValueError as e:
        raise RuntimeError("JWT_EXPIRE_MINUTES must be an integer") from e

    return secret, algorithm, expire_minutes


def create_access_token(*, user_id: int) -> str:
    secret, algorithm, expire_minutes = _get_jwt_settings()

    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=expire_minutes)
    payload = {"sub": str(user_id), "exp": exp}
    return jwt.encode(payload, secret, algorithm=algorithm)


def get_current_user_id(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> int:
    if creds is None or not creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = creds.credentials
    secret, algorithm, _expire_minutes = _get_jwt_settings()
    try:
        payload = jwt.decode(token, secret, algorithms=[algorithm])
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return int(sub)
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

