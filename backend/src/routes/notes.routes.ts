import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { NotesService } from '../services/notes.service';

const router = Router();
const notesService = new NotesService();
const notesController = new NotesController(notesService);

router.post('/', notesController.createNote);
router.get('/', notesController.listNotes);
router.get('/:id', notesController.getNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
router.get('/:id/html', notesController.getNoteHtml);

export default router;