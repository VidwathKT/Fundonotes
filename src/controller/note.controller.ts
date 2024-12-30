import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import * as noteService from '../service/note.service';


export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const newNote = await noteService.createNote(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: newNote,
      message: `Note created successfully`,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};


export const getAllNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body.createdBy)
    const notes = await noteService.getAllNotes(req.body.createdBy);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: notes,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};

export const getNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await noteService.getNote(req.params.noteId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: note,
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedNote = await noteService.updateNote(req.params.noteId, req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: updatedNote,
      message: 'Note updated successfully',
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};

export const permanentlyDeleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    await noteService.permanentlyDeleteNote(req.params.noteId);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`,
    });
  }
};
