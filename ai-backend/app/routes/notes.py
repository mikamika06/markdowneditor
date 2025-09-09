from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import markdown

from app.core.database import get_db
from app.services.note_service import NoteService
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.models.user import User
from app.routes.auth import get_current_user

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=List[NoteResponse])
async def get_notes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    notes = await service.get_user_notes(current_user.id)
    return notes


@router.post(
    "/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED
)
async def create_note(
    note_data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    note = await service.create_note(note_data, current_user.id)
    return note


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    note = await service.get_note_by_id(note_id)
    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    return note


@router.get("/{note_id}/html")
async def get_note_html(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    note = await service.get_note_by_id(note_id)
    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )

    # Simple markdown to HTML conversion
    try:
        # Basic markdown conversion without preprocessing
        html_content = markdown.markdown(
            note.content,
            extensions=[
                'markdown.extensions.extra',  # Tables, footnotes, etc.
                'markdown.extensions.nl2br',  # Convert newlines to <br>
                'markdown.extensions.fenced_code',  # Code blocks
                'markdown.extensions.tables',  # Table support
            ],
            tab_length=4,
        )

    except Exception as e:
        print(f"Markdown conversion error: {e}")
        # Simple fallback
        html_content = note.content.replace(
            '\n', '<br>'
        )  # Return just the HTML content as JSON
    return {"html": html_content}


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    existing_note = await service.get_note_by_id(note_id)
    if not existing_note or existing_note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    note = await service.update_note(note_id, note_data)
    return note


@router.delete("/{note_id}")
async def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NoteService(db)
    existing_note = await service.get_note_by_id(note_id)
    if not existing_note or existing_note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    success = await service.delete_note(note_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    return {"message": "Note deleted successfully"}
