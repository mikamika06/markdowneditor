from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional


class NoteBase(BaseModel):
    title: str = Field(..., description="Note title")
    content: str = Field(..., description="Note content in markdown")


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Updated note title")
    content: Optional[str] = Field(None, description="Update title content")


class NoteResponse(NoteBase):
    id: int = Field(..., description="Unique note id")
    user_id: int = Field(..., description="Owner user id")
    created_at: datetime = Field(..., description="Creation date")
    updated_at: datetime = Field(..., description="Last update date")

    model_config = ConfigDict(
        from_attributes=True, json_encoders={datetime: lambda v: v.isoformat()}
    )


class NoteInDb(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
