import { Note } from '../models/note.model';
import { INoteRepository } from '../repositories/interfaces/note-repository.interface';
import { RepositoryFactory } from '../repositories/repository-factory';

export class NotesService {
    private noteRepository: INoteRepository;
    private readonly MAX_CONTENT_SIZE = 10240;

    constructor() {
        this.noteRepository = RepositoryFactory.getNoteRepository();
    }

    async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
        
        if (!note.title || note.title.trim() === '') {
            throw new Error('Title cannot be empty');
        }

        if (!note.content || note.content.trim() === '') {
            throw new Error('Content cannot be empty');
        }

        if (note.content.length > this.MAX_CONTENT_SIZE) {
            throw new Error('Content size exceeds maximum allowed');
        }

        return this.noteRepository.create(note);
    }

    async getNote(id: string): Promise<Note | null> {
        return this.noteRepository.findById(id);
    }

    async updateNote(id: string, data: Partial<Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Note | null> {
        const note = await this.getNote(id);
        if (!note) return null;

        if (data.content && data.content.length > this.MAX_CONTENT_SIZE) {
            throw new Error('Content size exceeds maximum allowed');
        }

        if (data.title !== undefined && data.title.trim() === '') {
            throw new Error('Title cannot be empty');
        }

        if (data.content !== undefined && data.content.trim() === '') {
            throw new Error('Content cannot be empty');
        }

        return this.noteRepository.update(id, data);
    }

    async deleteNote(id: string): Promise<boolean> {
        return this.noteRepository.delete(id);
    }

    async listNotes(userId: string): Promise<Note[]> {
        return this.noteRepository.findAllByUserId(userId);
    }
}