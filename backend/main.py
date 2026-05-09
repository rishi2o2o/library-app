import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.books import router as books_router
from backend.routes.auth import router as auth_router
from backend.routes.loans import router as loans_router
from backend.routes.users import router as users_router

load_dotenv()

app = FastAPI(title="Library System API", version="1.0.0")

cors_origins = os.getenv("CORS_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books_router)
app.include_router(auth_router)
app.include_router(loans_router)
app.include_router(users_router)


@app.get("/health")
def health():
    return {"status": "ok"}

