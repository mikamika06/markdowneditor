from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User email address")


class UserCreate(UserBase):
    password: str = Field(
        min_length=6, max_length=128, description="User password (6 characters)"
    )


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., description="User password")


class UserResponse(UserBase):
    id: int = Field(..., description="Unique user id")
    created_at: datetime = Field(..., description="Created date")

    class Config:
        from_attributes = True


class UserInDb(UserBase):
    id: int
    password_hash: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = Field(None, description="New email")

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
