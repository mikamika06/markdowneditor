import { Note } from '../models/note.model';

export class NotesService {
    private notes: Note[] = [];
    private readonly MAX_CONTENT_SIZE = 10240;

    createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
        
        if (!note.title || note.title.trim() === '') {
            throw new Error('Title cannot be empty');
        }

        if (!note.content || note.content.trim() === '') {
            throw new Error('Content cannot be empty');
        }

        if (note.content.length > this.MAX_CONTENT_SIZE) {
            throw new Error('Content size exceeds maximum allowed');
        }

        const newNote: Note = {
            ...note,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.notes.push(newNote);
        return newNote;
    }

    getNote(id: string): Note | undefined {
        return this.notes.find(note => note.id === id);
    }

    updateNote(id: string, data: Partial<Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Note | undefined {
        const note = this.getNote(id);
        if (!note) return undefined;

        if (data.content && data.content.length > this.MAX_CONTENT_SIZE) {
            throw new Error('Content size exceeds maximum allowed');
        }

        if (data.title !== undefined && data.title.trim() === '') {
            throw new Error('Title cannot be empty');
        }

        if (data.content !== undefined && data.content.trim() === '') {
            throw new Error('Content cannot be empty');
        }

        if (data.title) note.title = data.title;
        if (data.content) note.content = data.content;
        note.updatedAt = new Date().toISOString();
        return note;
    }

    deleteNote(id: string): boolean {
        const index = this.notes.findIndex(note => note.id === id);
        if (index === -1) return false;
        this.notes.splice(index, 1);
        return true;
    }

    listNotes(userId: string): Note[] {
        return this.notes.filter(note => note.userId === userId)
    }

    private generateId(): string {
        return Math.random().toString(36).slice(2, 9);
    }
}