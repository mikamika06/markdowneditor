# ДОВІДКОВИЙ КОД ДЛЯ DATABASE.PY

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# Базовий клас для моделей
Base = declarative_base()

# URL бази даних (SQLite для простоти)
DATABASE_URL = "sqlite+aiosqlite:///./markdown_editor.db"

# Створення async engine для SQLite
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Логування SQL запитів для дебагу
    future=True
)

# Async session maker
AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Dependency для отримання сесії БД
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Функція для створення таблиць
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)