from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate


class NoteService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_note(self, note_data: NoteCreate, user_id: int) -> Note:
        db_note = Note(
            title=note_data.title,
            content=note_data.content,
            user_id=user_id
        )
        self.db.add(db_note)
        await self.db.commit()
        await self.db.refresh(db_note)
        return db_note
    
    async def get_note_by_id(self, note_id: int) -> Optional[Note]:
        result = await self.db.execute(select(Note).where(Note.id == note_id))
        return result.scalar_one_or_none()
    
    async def get_user_notes(self, user_id: int) -> List[Note]:
        result = await self.db.execute(
            select(Note).where(Note.user_id == user_id).order_by(Note.updated_at.desc())
        )
        return result.scalars().all()
    
    async def update_note(self, note_id: int, note_data: NoteUpdate) -> Optional[Note]:
        note = await self.get_note_by_id(note_id)
        if not note:
            return None
        
        if note_data.title is not None:
            note.title = note_data.title
        if note_data.content is not None:
            note.content = note_data.content
        
        await self.db.commit()
        await self.db.refresh(note)
        return note
    
    async def delete_note(self, note_id: int) -> bool:
        note = await self.get_note_by_id(note_id)
        if not note:
            return False
        
        await self.db.delete(note)
        await self.db.commit()
        return True
        
            