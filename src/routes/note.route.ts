import express, { Router } from 'express';
import * as NoteController from '../controller/note.controller';
import * as NoteValidator from '../validators/note.validator';
import { userAuth } from '../middlewares/auth.middleware';
import dotenv from 'dotenv';

dotenv.config();

const noteRoutes = (): Router => {
  const router = express.Router();


  router.post('/',NoteValidator.validateNewNote,userAuth(process.env.JWT_SECRET!),
  NoteController.createNote);

  router.get('/',userAuth(process.env.JWT_SECRET!),NoteController.getAllNotes);

  router.get('/:noteId',userAuth(process.env.JWT_SECRET!),NoteController.getNote);

  router.put('/:noteId',userAuth(process.env.JWT_SECRET!),NoteController.updateNote);

  router.delete('/:noteId',userAuth(process.env.JWT_SECRET!),
  NoteController.permanentlyDeleteNote);

  return router;
};

export default noteRoutes;
