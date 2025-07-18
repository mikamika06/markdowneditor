import { NotesController } from '../../src/controllers/notes.controller';
import { NotesService } from '../../src/services/notes.service';
import { Request, Response } from 'express';
import { Note } from '../../src/models/note.model';
import '../../src/models/express';

jest.mock('../../src/services/notes.service');
jest.mock('../../src/utils/markdown', () => ({
    markdownToHtml: jest.fn().mockReturnValue('<h1>Converted HTML</h1>')
}));

describe('NotesController', () => {
    let notesController: NotesController;
    let mockNotesService: jest.Mocked<NotesService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;
    let responseSend: jest.Mock;
    let responseType: jest.Mock;

    beforeEach(() => {
        responseJson = jest.fn().mockReturnThis();
        responseSend = jest.fn().mockReturnThis();
        responseType = jest.fn().mockReturnValue({ send: responseSend });
        responseStatus = jest.fn().mockReturnValue({ 
            json: responseJson,
            send: responseSend
        });
        
        mockRequest = {
            params: { id: 'note123' },
            body: {},
            user: { id: 'user123' }
        };
        
        mockResponse = {
            status: responseStatus,
            json: responseJson,
            send: responseSend,
            type: responseType
        };
        
        mockNotesService = new NotesService() as jest.Mocked<NotesService>;
        notesController = new NotesController(mockNotesService);
    });

    describe('createNote', () => {
        it('should create a note and return 201', () => {
            mockRequest.body = { title: 'Test Note', content: '# Test Content' };
            const mockNote: Note = {
                id: 'note123',
                userId: 'user123',
                title: 'Test Note',
                content: '# Test Content',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01'
            };
            mockNotesService.createNote = jest.fn().mockReturnValue(mockNote);
            
            notesController.createNote(mockRequest as Request, mockResponse as Response);
            
            expect(mockNotesService.createNote).toHaveBeenCalledWith({
                userId: 'user123',
                title: 'Test Note',
                content: '# Test Content'
            });
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(mockNote);
        });
    });

    describe('getNote', () => {
        it('should return 404 if note is not found', () => {
            mockNotesService.getNote = jest.fn().mockReturnValue(undefined);
            
            notesController.getNote(mockRequest as Request, mockResponse as Response);
            
            expect(mockNotesService.getNote).toHaveBeenCalledWith('note123');
            expect(responseStatus).toHaveBeenCalledWith(404);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Note not found' });
        });

        it('should return 403 if user does not own the note', () => {
            const mockNote: Note = {
                id: 'note123',
                userId: 'other-user',
                title: 'Test Note',
                content: '# Test Content',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01'
            };
            mockNotesService.getNote = jest.fn().mockReturnValue(mockNote);
            
            notesController.getNote(mockRequest as Request, mockResponse as Response);
            
            expect(responseStatus).toHaveBeenCalledWith(403);
            expect(responseJson).toHaveBeenCalledWith({ 
                message: 'Forbidden: You do not have access to this note' 
            });
        });

        it('should return the note if user owns it', () => {
            const mockNote: Note = {
                id: 'note123',
                userId: 'user123',
                title: 'Test Note',
                content: '# Test Content',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01'
            };
            mockNotesService.getNote = jest.fn().mockReturnValue(mockNote);
            
            notesController.getNote(mockRequest as Request, mockResponse as Response);
            
            expect(responseJson).toHaveBeenCalledWith(mockNote);
        });
    });
});
