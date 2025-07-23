import { NotesService } from '../../src/services/notes.service';

describe('NotesService Edge Cases', () => {
    let notesService: NotesService;
    const userId = 'user123';

    beforeEach(() => {
        notesService = new NotesService();
    });

    describe('createNote', () => {
        
        it('should handle empty title', () => {
            const noteData = {
                userId,
                title: '',
                content: 'Content'
            };
            
            expect(() => notesService.createNote(noteData)).toThrow('Title cannot be empty');
        });

        it('should handle empty content', () => {
            const noteData = {
                userId,
                title: 'Title',
                content: ''
            };
            
            expect(() => notesService.createNote(noteData)).toThrow('Content cannot be empty');
        });

        it('should handle extremely large content', () => {
            const largeContent = 'A'.repeat(11001); // 10KB+ of content
            const noteData = {
                userId,
                title: 'Large Note',
                content: largeContent
            };
            // console.log('Content length:', noteData.content.length);

            expect(() => notesService.createNote(noteData)).toThrow('Content size exceeds maximum allowed');
        });
    });

    describe('updateNote', () => {
        it('should handle special characters in content', () => {
            const note = notesService.createNote({
                userId,
                title: 'Test Note',
                content: 'Original content'
            });
            
            const specialChars = '!@#$%^&*()_+{}|:"<>?~`-=[]\\;\',./';
            const updatedNote = notesService.updateNote(note.id, {
                content: specialChars
            });
            
            expect(updatedNote?.content).toBe(specialChars);
        });

        it('should handle markdown syntax correctly', () => {
            const note = notesService.createNote({
                userId,
                title: 'Markdown Test',
                content: 'Simple text'
            });
            
            const markdownContent = '# Header\n## Subheader\n**Bold** *Italic*\n```code block```';
            const updatedNote = notesService.updateNote(note.id, {
                content: markdownContent
            });
            
            expect(updatedNote?.content).toBe(markdownContent);
        });
    });
});