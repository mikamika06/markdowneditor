# ДОВІДКОВИЙ КОД ДЛЯ NOTE CRUD ОПЕРАЦІЙ

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.core.database import get_db

router = APIRouter(prefix="/notes", tags=["notes"])

# GET /notes - отримати всі нотатки
@router.get("/", response_model=List[NoteResponse])
async def get_notes(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Note).offset(skip).limit(limit)
    )
    notes = result.scalars().all()
    return notes

# GET /notes/{note_id} - отримати конкретну нотатку
@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Нотатку не знайдено"
        )
    return note

# POST /notes - створити нову нотатку
@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate, 
    db: AsyncSession = Depends(get_db)
):
    # Створюємо новий об'єкт Note
    new_note = Note(
        title=note_data.title,
        content=note_data.content,
        user_id=1  # Поки що хардкод, потім додамо автентифікацію
    )
    
    # Додаємо в БД
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    
    return new_note

# PUT /notes/{note_id} - оновити нотатку
@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: AsyncSession = Depends(get_db)
):
    # Знаходимо нотатку
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Нотатку не знайдено"
        )
    
    # Оновлюємо поля
    if note_data.title is not None:
        note.title = note_data.title
    if note_data.content is not None:
        note.content = note_data.content
    
    await db.commit()
    await db.refresh(note)
    
    return note

# DELETE /notes/{note_id} - видалити нотатку
@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Нотатку не знайдено"
        )
    
    await db.delete(note)
    await db.commit()
    
    return None