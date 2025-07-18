import { NotesService } from '../../src/services/notes.service';
import { Note } from '../../src/models/note.model';

describe('NotesService', () => {
    let notesService: NotesService;
    const userId = 'user123';
    let testNoteId: string;

    beforeEach(() => {
        notesService = new NotesService();
        const testNote = notesService.createNote({
            userId,
            title: 'Test Note',
            content: '# Test Content'
        });
        testNoteId = testNote.id;
    });

    describe('createNote', () => {
        it('should create a note with correct fields', () => {
            const noteData = {
                userId,
                title: 'New Note',
                content: 'New Content'
            };
            const note = notesService.createNote(noteData);
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('userId', userId);
            expect(note).toHaveProperty('title', 'New Note');
            expect(note).toHaveProperty('content', 'New Content');
            expect(note).toHaveProperty('createdAt');
            expect(note).toHaveProperty('updatedAt');
        });
    });

    describe('getNote', () => {
        it('should return a note by id', () => {
            const note = notesService.getNote(testNoteId);
            expect(note).toBeDefined();
            expect(note?.id).toBe(testNoteId);
            expect(note?.title).toBe('Test Note');
        });

        it('should return undefined for non-existent note', () => {
            const note = notesService.getNote('nonexistent-id');
            expect(note).toBeUndefined();
        });
    });

    describe('updateNote', () => {
        it('should update a note correctly', () => {
            const updateData = {
                title: 'Updated Title',
                content: 'Updated Content'
            };
            const updatedNote = notesService.updateNote(testNoteId, updateData);
            expect(updatedNote?.title).toBe('Updated Title');
            expect(updatedNote?.content).toBe('Updated Content');
            expect(updatedNote?.updatedAt).not.toBe(updatedNote?.createdAt);
        });

        it('should return undefined for non-existent note', () => {
            const result = notesService.updateNote('nonexistent-id', { title: 'New Title' });
            expect(result).toBeUndefined();
        });
    });

    describe('deleteNote', () => {
        it('should delete a note correctly', () => {
            const result = notesService.deleteNote(testNoteId);
            const noteAfterDelete = notesService.getNote(testNoteId);
            expect(result).toBe(true);
            expect(noteAfterDelete).toBeUndefined();
        });

        it('should return false for non-existent note', () => {
            const result = notesService.deleteNote('nonexistent-id');
            expect(result).toBe(false);
        });
    });

    describe('listNotes', () => {
        it('should return only notes for the specified user', () => {
            notesService.createNote({
                userId: 'other-user',
                title: 'Other User Note',
                content: 'This should not be returned'
            });
            notesService.createNote({
                userId,
                title: 'Another Note',
                content: 'This should be returned'
            });
            const notes = notesService.listNotes(userId);
            expect(notes.length).toBe(2);
            expect(notes.every(note => note.userId === userId)).toBe(true);
        });

        it('should return empty array for user without notes', () => {
            const notes = notesService.listNotes('user-without-notes');
            expect(notes).toEqual([]);
        });
    });
});
