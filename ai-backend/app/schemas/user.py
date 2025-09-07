from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User email adress")


class UserCreate(UserBase):
    password: str = Field(
        min_length=6, 
        max_length=128,
        description="User password(6 characters)"
    )


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email адреса")
    password: str = Field(..., description="Пароль користувача")


class UserResponse(UserBase):
    """Схема для відповіді API з даними користувача"""
    id: int = Field(..., description="Унікальний ID користувача")
    created_at: datetime = Field(..., description="Дата створення акаунту")
    
    class Config:
        from_attributes = True  # Дозволяє конвертувати SQLAlchemy об'єкти


class UserInDB(UserBase):
    """Схема для внутрішнього використання (з хешем пароля)"""
    id: int
    password_hash: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    """Схема для оновлення даних користувача"""
    email: Optional[EmailStr] = Field(None, description="Новий email (опціонально)")
    
    class Config:
        from_attributes = True
