import express, { IRouter } from 'express';
import * as NoteController from '../controller/note.controller';
import * as NoteValidator from '../validators/note.validator';

const noteRoutes = (): IRouter => {

  const router = express.Router();
  
  router.post('/',NoteValidator.validateNewNote,NoteController.createNote);

  router.get('/',NoteController.getAllNotes);

  router.get('/:noteId',NoteController.getNote);

  router.put('/:noteId',NoteController.updateNote);

  router.delete('/:noteId',NoteController.permanentlyDeleteNote);

  return router;
};

export default noteRoutes;
