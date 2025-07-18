import { Request, Response } from 'express';
import { NotesService } from '../services/notes.service';
import { markdownToHtml } from '../utils/markdown';


export class NotesController {
    constructor(private notesService: NotesService) { }

    createNote = (req: Request, res: Response) => {
        try {
            const userId = req.user!.id; 
            const { title, content } = req.body;
            const note = this.notesService.createNote({ userId, title, content });
            return res.status(201).json(note);
        } catch (error) {
            throw error;
        }
    };

    getNote = (req: Request, res: Response) => {
        try {
            const note = this.notesService.getNote(req.params.id);
            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }
            if (note.userId !== req.user!.id) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this note' });
            }
            return res.json(note);
        } catch (error) {
            throw error;
        }
    };

    updateNote = (req: Request, res: Response) => {
        try {
            const note = this.notesService.getNote(req.params.id);
            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }
            if (note.userId !== req.user!.id) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this note' });
            }
            const updatedNote = this.notesService.updateNote(req.params.id, req.body);
            return res.json(updatedNote);
        } catch (error) {
            throw error;
        }
    };

    deleteNote = (req: Request, res: Response) => {
        try {
            const note = this.notesService.getNote(req.params.id);
            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }
            if (note.userId !== req.user!.id) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this note' });
            }
            this.notesService.deleteNote(req.params.id);
            return res.status(204).send();
        } catch (error) {
            throw error;
        }
    };

    listNotes = (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;
            const notes = this.notesService.listNotes(userId);
            return res.json(notes);
        } catch (error) {
            throw error;
        }
    };

    getNoteHtml = (req: Request, res: Response) => {
        try {
            const note = this.notesService.getNote(req.params.id);
            if (!note) {
                return res.status(404).json({ message: 'Note not found' });
            }
            if (note.userId !== req.user!.id) {
                return res.status(403).json({ message: 'Forbidden: You do not have access to this note' });
            }
            const html = markdownToHtml(note.content);
            return res.type('html').send(html);
        } catch (error) {
            throw error;
        }
    };
}