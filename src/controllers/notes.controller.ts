import { Request, Response } from 'express';
import { NotesService } from '../services/notes.service';
import { markdownToHtml } from '../utils/markdown';


export class NotesController {
    constructor(private notesService: NotesService) { }

    createNote = (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id; 
            const { title, content } = req.body;
            const note = this.notesService.createNote({ userId, title, content });
            return res.status(201).json(note);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    getNote = (req: Request, res: Response) => {
        try {
            const note = this.notesService.getNote(req.params.id);
            if (!note) return res.status(404).json({ message: 'Note not found' });
            return res.json(note);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    updateNote = (req: Request, res: Response) => {
        try {
            const note = this.notesService.updateNote(req.params.id, req.body);
            if (!note) return res.status(404).json({ message: 'Note not found' });
            return res.json(note);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteNote = (req: Request, res: Response) => {
        try {
            const success = this.notesService.deleteNote(req.params.id);
            if (!success) return res.status(404).json({ message: 'Note not found' });
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    listNotes = (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const userId = req.user.id;
            const notes = this.notesService.listNotes(userId);
            return res.json(notes);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    getNoteHtml = (req: Request, res: Response) => {
        try {
            const note = this.notesService.getNote(req.params.id);
            if (!note) return res.status(404).json({ message: 'Note not found' });
            const html = markdownToHtml(note.content);
            return res.type('html').send(html);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}