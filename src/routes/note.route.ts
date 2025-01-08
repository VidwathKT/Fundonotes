import express, { Router } from 'express';
import * as NoteController from '../controller/note.controller';
import * as NoteValidator from '../validators/note.validator';
import { userAuth } from '../middlewares/auth.middleware';
import dotenv from 'dotenv';
import {cacheNotes,cacheNoteById} from '../middlewares/cache.middleware'

dotenv.config();

const noteRoutes = (): Router => {
  const router = express.Router();


  router.post('/',NoteValidator.validateNewNote,userAuth(process.env.JWT_SECRET!),
  NoteController.createNote);

  router.get('/',userAuth(process.env.JWT_SECRET!),cacheNotes,NoteController.getAllNotes);

  router.get('/search',userAuth(process.env.JWT_SECRET!),NoteController.search);

  router.get('/:noteId',NoteValidator.validateNoteId,userAuth(process.env.JWT_SECRET!),
  cacheNoteById,NoteController.getNote);

  router.put('/:noteId',NoteValidator.validateNoteId,userAuth(process.env.JWT_SECRET!),
  NoteController.updateNote);

  router.delete('/:noteId',NoteValidator.validateNoteId,userAuth(process.env.JWT_SECRET!),
  NoteController.permanentlyDeleteNote);

  router.put('/:noteId/trash',NoteValidator.validateNoteId,userAuth(process.env.JWT_SECRET!),
    NoteController.trashNote);

  router.put('/:noteId/archive',NoteValidator.validateNoteId,userAuth(process.env.JWT_SECRET!),
      NoteController.archiveNote);

  return router;
};

export default noteRoutes;
