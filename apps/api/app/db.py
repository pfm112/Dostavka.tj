from sqlmodel import Session, create_engine
from .settings import settings

def _normalize_db_url(url: str) -> str:
    # Render часто дает postgres://..., а SQLAlchemy ожидает postgresql://...
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    # Переводим на драйвер psycopg (v3)
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)

    return url

DATABASE_URL = _normalize_db_url(settings.DATABASE_URL)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

def init_db():
    from .models import SQLModel
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
